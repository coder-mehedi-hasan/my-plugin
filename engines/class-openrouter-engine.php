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
        $base_url = esc_url_raw($params['baseUrl'] ?? 'https://openrouter.ai/api/v1');

        if (!$api_key || !$model || !$prompt) {
            return new WP_Error('missing_params', 'Missing required fields', ['status' => 400]);
        }

        $body = [
            'model' => $model,
            'messages' => array_filter([
                $context ? ['role' => 'system', 'content' => $context] : null,
                ['role' => 'user', 'content' => $prompt],
            ]),
        ];

        $response = wp_remote_post("$base_url/chat/completions", [
            'headers' => [
                'Authorization' => "Bearer $api_key",
                'Content-Type'  => 'application/json',
                'HTTP-Referer'  => home_url(),
            ],
            'body' => wp_json_encode($body),
            'timeout' => 20,
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);
        return rest_ensure_response(['reply' => $data['choices'][0]['message']['content'] ?? '']);
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
