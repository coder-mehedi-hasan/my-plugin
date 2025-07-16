<?php

if (!function_exists('my_plugin_log')) {
    function my_plugin_log($message, $type = 'INFO')
    {
        $log_dir = MY_PLUGIN_PATH . '/my-plugin-logs';
        $log_file = $log_dir . '/my-plugin.log';

        // Create directory if it doesn't exist
        if (!file_exists($log_dir)) {
            mkdir($log_dir, 0755, true);
        }

        $date = date('Y-m-d H:i:s');

        // If array or object, convert to readable string
        if (is_array($message) || is_object($message)) {
            $message = print_r($message, true);
        }

        $formatted = "[{$date}] {$type}: {$message}" . PHP_EOL;

        file_put_contents($log_file, $formatted, FILE_APPEND);
    }
}
