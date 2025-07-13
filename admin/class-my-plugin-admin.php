<?php

class My_Plugin_Admin {
    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }

    public function add_admin_menu() {
        add_menu_page(
            'AI Chatbot Settings',
            'AI Plugin',
            'manage_options',
            'my-plugin',
            [$this, 'render_admin_page'],
            'dashicons-admin-generic'
        );
    }

    public function render_admin_page() {
        echo '<div id="my-plugin-admin-root"></div>';
    }

    public function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_my-plugin') return;

        wp_enqueue_script(
            'my-plugin-admin',
            MY_PLUGIN_URL . 'build/admin.js',
            ['wp-element'],
            MY_PLUGIN_VERSION,
            true
        );

        wp_enqueue_style(
            'my-plugin-admin-style',
            MY_PLUGIN_URL . 'build/admin.css',
            [],
            MY_PLUGIN_VERSION
        );
    }
}
