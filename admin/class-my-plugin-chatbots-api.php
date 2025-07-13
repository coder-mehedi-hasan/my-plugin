<?php
if (!defined('ABSPATH')) exit;

class My_Plugin_Chatbots_API
{
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes()
    {
        register_rest_route('my-plugin/v1', '/chatbots', [
            [
                'methods'  => 'GET',
                'callback' => [$this, 'get_chatbots'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ],
            [
                'methods'  => 'POST',
                'callback' => [$this, 'save_chatbots'],
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                },
            ],
        ]);
    }

    public function get_chatbots()
    {
        return get_option('my_plugin_chatbots', []);
    }

    public function save_chatbots($request)
    {
        $data = $request->get_json_params();
        update_option('my_plugin_chatbots', $data);
        return rest_ensure_response(['success' => true]);
    }
}
