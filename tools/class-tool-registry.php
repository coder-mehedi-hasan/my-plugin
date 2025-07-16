<?php

class My_Plugin_Tool_Registry {
    public static function get_all_tools(): array {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'convert_csv_to_json',
                    'description' => 'You are an AI assistant. You have access to tools like `convert_csv_to_json`. When the user provides a CSV file URL, call the appropriate tool with `{ csv_url: "..." }`',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'csv_url' => [
                                'type' => 'string',
                                'description' => 'URL to the CSV file',
                            ]
                        ],
                        'required' => ['csv_url'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'summarize_json_data',
                    'description' => 'Summarizes JSON data into insights.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'json_string' => [
                                'type' => 'string',
                                'description' => 'JSON data as a string.',
                            ]
                        ],
                        'required' => ['json_string'],
                    ],
                ],
            ],
            // Add more tools here
        ];
    }
}


?>