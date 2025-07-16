<?php

class My_Plugin_Frontend
{
    public function __construct()
    {
        add_shortcode('my_plugin_chatbox', [$this, 'render_chatbox_shortcode']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_chatbox_assets']);
    }

    public function enqueue_chatbox_assets()
    {
        if (!is_singular()) return;

        wp_enqueue_script(
            'my-plugin-chatbox',
            MY_PLUGIN_URL . 'build/chatbox.js',
            ['wp-element'],
            MY_PLUGIN_VERSION,
            true
        );

        wp_enqueue_style(
            'my-plugin-chatbox-style',
            MY_PLUGIN_URL . 'build/chatbox.css',
            [],
            MY_PLUGIN_VERSION
        );

        wp_localize_script('my-plugin-chatbox', 'MyPluginData', [
            'apiUrl' => rest_url(),
            'nonce' => wp_create_nonce('wp_rest')
        ]);
    }

    public function render_chatbox_shortcode($atts)
    {
        $atts = shortcode_atts(array(
            'id' => 'default',
        ), $atts, 'my_plugin_chatbox');

        $bot_id = esc_attr($atts['id']);

        return '<div id="my-plugin-chatbox-root" data-bot-id="' . $bot_id . '"></div>';
        // return '<div id="my-plugin-chatbox-root"></div>';
    }
}
