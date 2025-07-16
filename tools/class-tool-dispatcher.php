<?php

class My_Plugin_Tool_Dispatcher {
    public static function run(string $tool_name, array $args): array {
        switch ($tool_name) {
            case 'convert_csv_to_json':
                return self::convert_csv_to_json($args['csv_url'] ?? '');
            case 'summarize_json_data':
                return self::summarize_json_data($args['json_string'] ?? '');
            default:
                return ['error' => 'Tool not found'];
        }
    }

    private static function convert_csv_to_json(string $url): array {
        // Same implementation as before
    }

    private static function summarize_json_data(string $json): array {
        // Parse and summarize
    }
}

?>