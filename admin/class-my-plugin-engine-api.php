<?php
if (!defined('ABSPATH')) exit;

require_once MY_PLUGIN_PATH . 'engines/class-engine-loader.php';

class My_Plugin_Engine_API
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes()
    {
        register_rest_route('my-plugin/v1', '/engine/send', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_send'],
            'permission_callback' => fn() => current_user_can('manage_options'),
        ]);

        register_rest_route('my-plugin/v1', '/engine/stream', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_stream'],
            'permission_callback' => '__return_true',
        ]);


        register_rest_route('my-plugin/v1', '/engine/models', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_models'],
            'permission_callback' => fn() => current_user_can('manage_options'),
        ]);
    }


    public function handle_stream($request)
    {

        $params = $request->get_json_params();
        $chatbot_id = sanitize_text_field($params['chatbotId'] ?? '');
        $prompt     = sanitize_textarea_field($params['prompt'] ?? '');


        if (!$chatbot_id || !$prompt) {
            return new WP_Error('missing_data', 'Chatbot ID and prompt required.', ['status' => 400]);
        }

        // 🔍 Fetch chatbots config from wp_options
        $chatbots = get_option('my_plugin_chatbots', []);
        $bot = null;

        foreach ($chatbots as $item) {
            if ($item['id'] === $chatbot_id) {
                $bot = $item;
                break;
            }
        }

        if (!$bot || !isset($bot['environment']['type'], $bot['environment']['apiKey'], $bot['model'])) {
            return new WP_Error('not_found', 'Chatbot or environment not properly configured.', ['status' => 404]);
        }

        // Build payload
        $engine = My_Plugin_Engine_Loader::get_engine($bot['environment']['type']);
        if (!$engine) {
            return new WP_Error('invalid_engine', 'No engine found for this environment type.', ['status' => 400]);
        }

        if (!$engine || !method_exists($engine, 'stream_message')) {
            return new WP_Error('stream_unsupported', 'Engine does not support streaming.', ['status' => 400]);
        }

        $engine->stream_message([
            'model'   => sanitize_text_field($bot['model']),
            'apiKey'  => sanitize_text_field($bot['environment']['apiKey']),
            'baseUrl' => esc_url_raw($bot['environment']['baseUrl'] ?? ''),
            'context' => sanitize_textarea_field($bot['context'] ?? ''),
            'prompt'  => $prompt,
        ]); // This will exit early
    }


    public function handle_send($request)
    {

        $params = $request->get_json_params();
        $chatbot_id = sanitize_text_field($params['chatbotId'] ?? '');
        $prompt     = sanitize_textarea_field($params['prompt'] ?? '');


        if (!$chatbot_id || !$prompt) {
            return new WP_Error('missing_data', 'Chatbot ID and prompt required.', ['status' => 400]);
        }

        // 🔍 Fetch chatbots config from wp_options
        $chatbots = get_option('my_plugin_chatbots', []);
        $bot = null;

        foreach ($chatbots as $item) {
            if ($item['id'] === $chatbot_id) {
                $bot = $item;
                break;
            }
        }

        if (!$bot || !isset($bot['environment']['type'], $bot['environment']['apiKey'], $bot['model'])) {
            return new WP_Error('not_found', 'Chatbot or environment not properly configured.', ['status' => 404]);
        }

        // Build payload
        $engine = My_Plugin_Engine_Loader::get_engine($bot['environment']['type']);
        if (!$engine) {
            return new WP_Error('invalid_engine', 'No engine found for this environment type.', ['status' => 400]);
        }

        return $engine->send_message([
            'model'   => sanitize_text_field($bot['model']),
            'apiKey'  => sanitize_text_field($bot['environment']['apiKey']),
            'baseUrl' => esc_url_raw($bot['environment']['baseUrl'] ?? ''),
            'context' => sanitize_textarea_field($bot['context'] ?? ''),
            'prompt'  => $prompt,
        ]);
    }


    public function handle_models($request)
    {
        $params = $request->get_json_params();
        $engine = My_Plugin_Engine_Loader::get_engine($params['type'] ?? '');
        return $engine ? $engine->fetch_models($params) : new WP_Error('invalid_engine', 'Unsupported engine type', ['status' => 400]);
    }
}
