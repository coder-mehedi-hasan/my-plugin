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

        register_rest_route('my-plugin/v1', '/environments/(?P<id>[^/]+)', [
            'methods'  => 'DELETE',
            'callback' => [$this, 'remove_single_environments'],
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

    public function remove_single_environments($request)
    {
        $id = $request->get_param('id');
        $environments = get_option('my_plugin_environments', []);

        $indexToRemove = null;
        foreach ($environments as $index => $environment) {
            if (isset($environment['id']) && $environment['id'] === $id) {
                $indexToRemove = $index;
                break;
            }
        }

        if ($indexToRemove === null) {
            return new WP_Error('not_found', 'Environment not found.', ['status' => 404]);
        }

        unset($environments[$indexToRemove]);

        $environments = array_values($environments);

        update_option('my_plugin_environments', $environments);

        return rest_ensure_response([
            'success' => true,
            'message' => "Environment with ID '$id' removed successfully.",
        ]);
    }
}
