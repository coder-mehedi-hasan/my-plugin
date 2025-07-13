<?php

/**
 * Plugin Name: My React Chat Plugin
 * Description: A WordPress plugin with React-based admin and chatbox shortcode.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

define('MY_PLUGIN_VERSION', '1.0.0');
define('MY_PLUGIN_URL', plugin_dir_url(__FILE__));
define('MY_PLUGIN_PATH', plugin_dir_path(__FILE__));

require_once MY_PLUGIN_PATH . 'admin/class-my-plugin-admin.php';
require_once MY_PLUGIN_PATH . 'user/class-my-plugin-frontend.php';

final class My_React_Plugin
{
    public function __construct()
    {
        add_action('plugins_loaded', [$this, 'init']);
    }

    public function init()
    {
        new My_Plugin_Admin();
        new My_Plugin_Frontend();
    }
}

new My_React_Plugin();
