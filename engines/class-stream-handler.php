<?php

if (!defined('ABSPATH')) exit;

require_once MY_PLUGIN_PATH . 'tools/class-tool-registry.php';
require_once MY_PLUGIN_PATH . 'tools/class-tool-dispatcher.php';


class My_Plugin_Stream_Handler
{
    public function handle(string $base_url, string $api_key, string $model, array $messages, string $context)
    {
        if (empty($api_key) || empty($model) || !is_array($messages) || empty($messages)) {
            status_header(400);
            echo "Missing or invalid parameters.";
            exit;
        }

        // Inject context as system message if not present
        $has_system = array_filter($messages, fn($msg) => $msg['role'] === 'system');
        if ($context && empty($has_system)) {
            array_unshift($messages, ['role' => 'system', 'content' => $context]);
        }

        $tools = My_Plugin_Tool_Registry::get_all_tools();

        // Step 1: Dry-run request (no stream) to check for tool calls
        $body = wp_json_encode([
            'model'    => $model,
            'messages' => $messages,
            'tools'    => $tools,
            'tool_choice' => 'auto',
        ]);

        $ch = curl_init("$base_url/chat/completions");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer $api_key",
            'Content-Type: application/json',
            'Referer: ' . home_url(),
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            status_header(500);
            echo "cURL Error: " . curl_error($ch);
            curl_close($ch);
            exit;
        }
        curl_close($ch);
        $data = json_decode($response, true);
        $tool_calls = $data['choices'][0]['message']['tool_calls'] ?? [];
        
        // Step 2: Handle tool calls if present
        if (!empty($tool_calls)) {
            foreach ($tool_calls as $tool) {
                $args = json_decode($tool['function']['arguments'] ?? '{}', true);
                $tool_result = My_Plugin_Tool_Dispatcher::run($tool['function']['name'], $args);
                $messages[] = [
                    'role'    => 'tool',
                    'name'    => $tool['function']['name'],
                    'content' => json_encode($tool_result),
                ];
            }
        }

        // Step 3: No tool calls – stream the result
        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');

        $ch = curl_init("$base_url/chat/completions");

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER    => false,
            CURLOPT_POST              => true,
            CURLOPT_HTTPHEADER        => [
                "Authorization: Bearer $api_key",
                'Content-Type: application/json',
                'Accept: text/event-stream',
                'Referer: ' . home_url(),
            ],
            CURLOPT_POSTFIELDS        => json_encode([
                'model'    => $model,
                'stream'   => true,
                'messages' => $messages,
            ]),
            CURLOPT_WRITEFUNCTION     => function ($ch, $chunk) {
                echo $chunk;
                @ob_flush();
                flush();
                return strlen($chunk);
            },
        ]);

        curl_exec($ch);

        if (curl_errno($ch)) {
            echo "Stream Error: " . curl_error($ch);
        }

        curl_close($ch);
        exit;
    }
}
