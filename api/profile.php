<?php
// Allow cross-origin resource sharing (CORS)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

// Make sure it's a GET request
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    // Return method not allowed error
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method not allowed"));
    exit;
}

// Validate JWT token
$authMiddleware = new AuthMiddleware();
$payload = $authMiddleware->validateToken();

// If token is valid, get user profile
echo $authController->getProfile($payload['data']['id']);