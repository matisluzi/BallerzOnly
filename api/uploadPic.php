<?php

// Allow cross-origin resource sharing (CORS)
$allowed_origins = [
    'http://localhost:5173',
    'https://cise.ufl.edu/~m.luzi/BallerzOnly'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database, controller, and middleware files
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Initialize auth controller
$authController = new AuthController($db);

// Make sure it's a POST request
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method not allowed"));
    exit;
}

// Validate JWT token
$authMiddleware = new AuthMiddleware();
$payload = $authMiddleware->validateToken();
$userId = $payload['data']['id'];

// Get image data from request
$data = json_decode(file_get_contents("php://input"));
$imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data->image));

// Upload profile picture
echo $authController->uploadProfilePicture($userId, $imageData);