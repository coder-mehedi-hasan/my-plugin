<?php
if (!defined('ABSPATH')) exit;

require_once __DIR__ . '/class-engine-interface.php';

class My_Plugin_OpenRouter_Engine implements My_Plugin_Engine_Interface
{
    public function send_message(array $params): WP_REST_Response|WP_Error
    {
        $api_key  = sanitize_text_field($params['apiKey'] ?? '');
        $model    = sanitize_text_field($params['model'] ?? '');
        $prompt   = sanitize_textarea_field($params['prompt'] ?? '');
        $context  = sanitize_textarea_field($params['context'] ?? '');

        // Validate base URL, or use fallback
        $raw_base = trim($params['baseUrl'] ?? '');
        $base_url = esc_url_raw($raw_base);
        if (empty($base_url)) {
            $base_url = 'https://openrouter.ai/api/v1';
        }

        if (!$api_key || !$model || !$prompt) {
            return new WP_Error('missing_params', 'Missing required fields: API key, model, or prompt', ['status' => 400]);
        }

        $messages = [];

        if (!empty($context)) {
            $messages[] = ['role' => 'system', 'content' => $context];
        }

        $messages[] = ['role' => 'user', 'content' => $prompt];

        $body = [
            'model' => $model,
            'messages' => $messages,
        ];

        $response = wp_remote_post("{$base_url}/chat/completions", [
            'headers' => [
                'Authorization' => "Bearer {$api_key}",
                'Content-Type'  => 'application/json',
                'HTTP-Referer'  => home_url(),
            ],
            'body'    => wp_json_encode($body),
            'timeout' => 20,
        ]);

        if (is_wp_error($response)) {
            return new WP_Error('http_error', $response->get_error_message(), ['status' => 500]);
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);

        if (!isset($data['choices'][0]['message']['content'])) {
            return new WP_Error('incomplete_response', 'Invalid API response.', ['status' => 502, 'debug' => $data]);
        }

        return rest_ensure_response([
            'reply' => $data['choices'][0]['message']['content'],
        ]);
    }


    public function stream_message(array $params)
    {
        $api_key  = sanitize_text_field($params['apiKey'] ?? '');
        $model    = sanitize_text_field($params['model'] ?? '');
        $prompt   = sanitize_textarea_field($params['prompt'] ?? '');
        $context  = sanitize_textarea_field($params['context'] ?? '');
        $raw_base = trim($params['baseUrl'] ?? '');
        $base_url = esc_url_raw($raw_base);
        if (empty($base_url)) {
            $base_url = 'https://openrouter.ai/api/v1';
        }

        if (!$api_key || !$model || !$prompt) {
            status_header(400);
            echo "Missing parameters";
            exit;
        }

        // Prepare messages
        $messages = [];

        if (!empty($context)) {
            $messages[] = ['role' => 'system', 'content' => $context];
        }

        $messages[] = ['role' => 'user', 'content' => $prompt];

        // Prepare cURL manually
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $base_url . '/chat/completions');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $api_key,
            'Content-Type: application/json',
            'Accept: text/event-stream',
            'Referer: ' . home_url(),
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'model'    => $model,
            'stream'   => true,
            'messages' => $messages,
        ]));

        curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($ch, $chunk) {
            echo $chunk;
            @ob_flush();
            flush();
            return strlen($chunk);
        });

        // Required for real-time output
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');

        curl_exec($ch);
        curl_close($ch);
        exit;
    }


    public function fetch_models(array $params): WP_REST_Response|WP_Error
    {
        $api_key  = sanitize_text_field($params['apiKey'] ?? '');
        $base_url = esc_url_raw($params['baseUrl'] ?? 'https://openrouter.ai/api/v1');

        $response = wp_remote_get("$base_url/models", [
            'headers' => [
                'Authorization' => "Bearer $api_key",
                'Content-Type'  => 'application/json',
            ],
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);
        return rest_ensure_response($data['data'] ?? []);
    }
}
