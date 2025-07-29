<?php

class My_Plugin_Tool_Registry
{
    public static function get_all_tools(): array
    {
        return [
            [
                "type" => "function",
                "function" => [
                    "name" => "searchGutenbergBooks",
                    "description" => "Search for books in the Project Gutenberg library based on specified search terms",
                    "parameters" => [
                        "type" => "object",
                        "properties" => [
                            "search_terms" => [
                                "type" => "array",
                                "items" => ["type" => "string"],
                                "description" => "List of search terms to find books in the Gutenberg library"
                            ]
                        ],
                        "required" => ["search_terms"]
                    ]
                ]
            ]
            // Add more tools here
        ];
    }
}
