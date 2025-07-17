<?php
require_once '../config/database.php';

setCORSHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['message' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];

// Validate file
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid file type. Only JPG, PNG, GIF, and WebP allowed.']);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['message' => 'File too large. Maximum size is 5MB.']);
    exit;
}

// Create upload directory if not exists
$uploadDir = '../../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('upload_') . '.' . $extension;
$filepath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    // Return the public URL
    $publicUrl = '/uploads/' . $filename;
    
    echo json_encode([
        'message' => 'File uploaded successfully',
        'url' => $publicUrl,
        'filename' => $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to upload file']);
}
?>
