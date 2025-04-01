<?php
require_once __DIR__ . '/../utils/JwtHandler.php';

class AuthMiddleware {
    protected $jwtHandler;
    
    public function __construct() {
        $this->jwtHandler = new JwtHandler();
    }
    
    public function validateToken() {
        // Get all headers
        $allHeaders = getallheaders();
        $authorizationHeader = isset($allHeaders['Authorization']) ? $allHeaders['Authorization'] : '';
        
        // Check if Authorization header exists
        if (!$authorizationHeader) {
            // Return 401 Unauthorized header
            header("HTTP/1.1 401 Unauthorized");
            
            // Return error response
            echo json_encode([
                'success' => false,
                'message' => 'Authorization token is missing'
            ]);
            exit;
        }
        
        // Extract the token from Authorization header
        // Format: "Bearer [token]"
        $jwt = '';
        
        if (preg_match('/Bearer\s(\S+)/', $authorizationHeader, $matches)) {
            $jwt = $matches[1];
        }
        
        // If token is not found in the correct format
        if (!$jwt) {
            // Return 401 Unauthorized header
            header("HTTP/1.1 401 Unauthorized");
            
            // Return error response
            echo json_encode([
                'success' => false,
                'message' => 'Invalid authorization format'
            ]);
            exit;
        }
        
        // Validate the token
        $payload = $this->jwtHandler->decode($jwt);
        
        // If token is invalid or expired
        if (!$payload) {
            // Return 401 Unauthorized header
            header("HTTP/1.1 401 Unauthorized");
            
            // Return error response
            echo json_encode([
                'success' => false,
                'message' => 'Invalid or expired token'
            ]);
            exit;
        }
        
        // Token is valid, return the payload
        return $payload;
    }
}