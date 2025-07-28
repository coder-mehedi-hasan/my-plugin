<?php
if (!defined('ABSPATH')) exit;

require_once MY_PLUGIN_PATH . 'engines/class-openrouter-engine.php';
require_once MY_PLUGIN_PATH . 'engines/class-openai-engine.php';


class My_Plugin_Engine_Loader
{
    public static function get_engine(string $type): ?My_Plugin_Engine_Interface
    {
        return match ($type) {
            'OpenRouter' => new My_Plugin_OpenRouter_Engine(),
            'OpenAI'=> new My_Plugin_OpenAI_Engine(),
            // Add more engines here
            default => null,
        };
    }
}
