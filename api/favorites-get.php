<?php
// Allow cross-origin resource sharing (CORS)
// Allow specific origins
$allowed_origins = [
    'http://localhost:5173',
    'https://cise.ufl.edu/~m.luzi/BallerzOnly'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include required files
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/controllers/FavoritesController.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';

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

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Initialize favorites controller
$favoritesController = new FavoritesController($db);

// Call get favorites method
echo $favoritesController->getFavorites($payload['data']['id']);