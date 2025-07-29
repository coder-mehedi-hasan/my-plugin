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

        register_rest_route('my-plugin/v1', '/chatbots/(?P<id>[^/]+)', [
            'methods'  => 'DELETE',
            'callback' => [$this, 'remove_single_chatbot'],
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
            'args' => [
                'id' => [
                    'required' => true,
                ],
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

    public function remove_single_chatbot($request)
    {
        $id = $request->get_param('id');
        $chatbots = get_option('my_plugin_chatbots', []);

        $indexToRemove = null;
        foreach ($chatbots as $index => $chatbot) {
            if (isset($chatbot['id']) && $chatbot['id'] === $id) {
                $indexToRemove = $index;
                break;
            }
        }

        if ($indexToRemove === null) {
            return new WP_Error('not_found', 'Chatbot not found.', ['status' => 404]);
        }

        unset($chatbots[$indexToRemove]);

        $chatbots = array_values($chatbots);

        update_option('my_plugin_chatbots', $chatbots);

        return rest_ensure_response([
            'success' => true,
            'message' => "Chatbot with ID '$id' removed successfully.",
        ]);
    }
}
