<?php

class My_Plugin_Tool_Registry {
    public static function get_all_tools(): array {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'convert_csv_to_json',
                    'description' => 'Converts a CSV file (given by URL) into JSON.',
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