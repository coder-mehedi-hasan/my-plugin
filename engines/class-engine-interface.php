<?php
if (!defined('ABSPATH')) exit;

interface My_Plugin_Engine_Interface
{
    public function send_message(array $params): WP_REST_Response|WP_Error;
    public function fetch_models(array $params): WP_REST_Response|WP_Error;
    public function stream_message(array $params): void;
}
