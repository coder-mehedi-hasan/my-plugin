<?php

class My_Plugin_Tool_Dispatcher
{
    public static function run(string $tool_name, array $args): array
    {
        switch ($tool_name) {
            case 'convert_csv_to_json':
                return self::convert_csv_to_json($args['csv_url'] ?? '');
            case 'summarize_json_data':
                return self::summarize_json_data($args['json_string'] ?? '');
            case 'get_biodata':
                return self::get_biodata($args['name'] ?? '');
            default:
                return ['error' => 'Tool not found'];
        }
    }

    private static function convert_csv_to_json(string $url): array
    {
        if (empty($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
            return ['error' => 'Invalid or missing CSV URL'];
        }

        $response = wp_remote_get($url);

        if (is_wp_error($response)) {
            return ['error' => 'Unable to fetch CSV file: ' . $response->get_error_message()];
        }

        $csv = wp_remote_retrieve_body($response);

        if (!$csv) {
            return ['error' => 'Empty CSV data'];
        }

        $lines = explode(PHP_EOL, trim($csv));
        $headers = str_getcsv(array_shift($lines));

        $json_array = [];
        foreach ($lines as $line) {
            $row = str_getcsv($line);
            if (count($row) === count($headers)) {
                $json_array[] = array_combine($headers, $row);
            }
        }

        return ['json' => $json_array];
    }

    private static function get_biodata(string $name): array
    {
        // In a real case, you'd query a DB or user profile.
        if (strtolower($name) === 'mehedi') {
            return [
                'name'       => 'Mehedi Hasan',
                'dob'        => '1997-05-18',
                'education'  => 'BSc in Computer Science',
                'location'   => 'Dhaka, Bangladesh',
                'interests'  => ['AI', 'Web Development', 'Open Source'],
            ];
        }

        return ['error' => 'No biodata found for ' . $name];
    }

    private static function summarize_json_data(string $json): array
    {
        // Parse and summarize
    }
}
