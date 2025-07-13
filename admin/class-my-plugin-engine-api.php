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

        register_rest_route('my-plugin/v1', '/engine/models', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_models'],
            'permission_callback' => fn() => current_user_can('manage_options'),
        ]);
    }

    public function handle_send($request)
    {
        $params = $request->get_json_params();
        $engine = My_Plugin_Engine_Loader::get_engine($params['type'] ?? '');
        return $engine ? $engine->send_message($params) : new WP_Error('invalid_engine', 'Unsupported engine type', ['status' => 400]);
    }

    public function handle_models($request)
    {
        $params = $request->get_json_params();
        $engine = My_Plugin_Engine_Loader::get_engine($params['type'] ?? '');
        return $engine ? $engine->fetch_models($params) : new WP_Error('invalid_engine', 'Unsupported engine type', ['status' => 400]);
    }
}
