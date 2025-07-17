<?php
// Main API router
require_once '../config/database.php';

setCORSHeaders();

// Get the request URI and method
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove query string and get path
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove /api from path if present
$path = str_replace('/api', '', $path);

// Route the request
switch($path) {
    case '/promos':
        require_once 'endpoints/promos.php';
        break;
    case '/articles':
        require_once 'endpoints/articles.php';
        break;
    case '/products':
        require_once 'endpoints/products.php';
        break;
    case '/sponsors':
        require_once 'endpoints/sponsors.php';
        break;
    case '/comments':
        require_once 'endpoints/comments.php';
        break;
    case '/settings':
        require_once 'endpoints/settings.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint not found']);
        break;
}
?>
