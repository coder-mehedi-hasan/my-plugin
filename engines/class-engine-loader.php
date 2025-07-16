<?php
if (!defined('ABSPATH')) exit;

require_once MY_PLUGIN_PATH . 'engines/class-openrouter-engine.php';


class My_Plugin_Engine_Loader
{
    public static function get_engine(string $type): ?My_Plugin_Engine_Interface
    {
        return match ($type) {
            'OpenRouter' => new My_Plugin_OpenRouter_Engine(),
            // Add more engines here
            default => null,
        };
    }
}
