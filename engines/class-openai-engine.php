<?php
if (!defined('ABSPATH')) exit;

require_once MY_PLUGIN_PATH . 'engines/class-engine-interface.php';
require_once MY_PLUGIN_PATH . 'engines/class-stream-handler.php';

class My_Plugin_OpenAI_Engine implements My_Plugin_Engine_Interface
{
    private $base_url = "https://api.openai.com/v1";
    private $tools = [];
    public function __construct()
    {
        $this->tools = My_Plugin_Tool_Registry::get_all_tools();
    }

    public function send_message(array $params): WP_REST_Response|WP_Error {}
    public function stream_message(array $params) {}


    public function stream_message_raw(array $params)
    {
        $api_key   = sanitize_text_field($params['apiKey'] ?? '');
        $model     = sanitize_text_field($params['model'] ?? '');
        $context   = sanitize_textarea_field($params['context'] ?? '');
        $raw_base  = trim($params['baseUrl'] ?? '');
        $base_url  = esc_url_raw($raw_base) ?: $this->base_url;
        $messages  = $params['messages'] ?? [];
        $temperature = $params['temperature'] ?? null;


        $handler = new My_Plugin_Stream_Handler();
        $handler->handle($base_url, $api_key, $model, $messages, $context, $temperature);
    }

    public function fetch_models(array $params): WP_REST_Response|WP_Error
    {
        $api_key  = sanitize_text_field($params['apiKey'] ?? '');
        $base_url = esc_url_raw($params['baseUrl'] ?? $this->base_url);

        $response = wp_remote_get("$base_url/models", [
            'headers' => [
                'Authorization' => "Bearer $api_key",
                'Content-Type'  => 'application/json',
            ],
        ]);
        // my_plugin_log("from openai fetch models");

        if (is_wp_error($response)) {
            return $response;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);
        return rest_ensure_response($data['data'] ?? []);
    }
}
