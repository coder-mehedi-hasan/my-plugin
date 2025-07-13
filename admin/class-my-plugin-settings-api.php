<?php
if (!defined('ABSPATH')) exit;

class My_Plugin_Settings_API
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes()
    {
        register_rest_route('my-plugin/v1', '/environments', [
            [
                'methods'  => 'GET',
                'callback' => [$this, 'get_environments'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ],
            [
                'methods'  => 'POST',
                'callback' => [$this, 'save_environments'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ],
        ]);
    }

    public function get_environments()
    {
        $data = get_option('my_plugin_environments', []);
        return rest_ensure_response($data);
    }

    public function save_environments($request)
    {
        $environments = $request->get_json_params();
        update_option('my_plugin_environments', $environments);
        return rest_ensure_response(['success' => true]);
    }
}
