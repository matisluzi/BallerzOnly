<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/JwtHandler.php';

class AuthController {
    private $db;
    private $user;
    private $jwtHandler;
    
    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
        $this->jwtHandler = new JwtHandler();
    }
    
    // Register a new user
    public function register($data) {
        // Required fields validation
        if (
            empty($data->name) ||
            empty($data->email) ||
            empty($data->password)
        ) {
            // Set HTTP response code - 400 Bad Request
            http_response_code(400);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "All fields are required"
            ));
        }
        
        // Set user property values
        $this->user->name = $data->name;
        $this->user->email = $data->email;
        $this->user->password = $data->password;
        
        // Create the user
        if ($this->user->create()) {
            // Set HTTP response code - 201 Created
            http_response_code(201);
            
            // Response message
            return json_encode(array(
                "success" => true,
                "message" => "User registered successfully"
            ));
        } else {
            // Check if email already exists
            if ($this->user->emailExists()) {
                // Set HTTP response code - 409 Conflict
                http_response_code(409);
                
                // Response message
                return json_encode(array(
                    "success" => false,
                    "message" => "Email already exists"
                ));
            }
            
            // Set HTTP response code - 500 Internal Server Error
            http_response_code(500);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "Unable to register user"
            ));
        }
    }
    
    // Login user
    public function login($data) {
        // Required fields validation
        if (
            empty($data->email) ||
            empty($data->password)
        ) {
            // Set HTTP response code - 400 Bad Request
            http_response_code(400);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "Email and password are required"
            ));
        }
        
        // Set email property
        $this->user->email = $data->email;
        
        // Check if email exists
        if ($this->user->emailExists()) {
            // Verify the password
            if (password_verify($data->password, $this->user->password)) {
                // Create JWT token
                $token = $this->jwtHandler->generateToken(array(
                    "id" => $this->user->id,
                    "name" => $this->user->name,
                    "email" => $this->user->email
                ));
                
                // Set HTTP response code - 200 OK
                http_response_code(200);
                
                // Response message with token
                return json_encode(array(
                    "success" => true,
                    "message" => "Login successful",
                    "token" => $token,
                    "user" => array(
                        "id" => $this->user->id,
                        "name" => $this->user->name,
                        "email" => $this->user->email
                    )
                ));
            } else {
                // Set HTTP response code - 401 Unauthorized
                http_response_code(401);
                
                // Response message
                return json_encode(array(
                    "success" => false,
                    "message" => "Invalid password"
                ));
            }
        } else {
            // Set HTTP response code - 404 Not Found
            http_response_code(404);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "User not found"
            ));
        }
    }

    public function getProfile($userId) {
        try {
            $query = "SELECT id, name, email, profile_picture FROM users WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$userId]);
            
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Convert BLOB to base64 for sending to frontend
                if ($user['profile_picture']) {
                    $user['profile_picture'] = base64_encode($user['profile_picture']);
                }
                
                return json_encode(array(
                    "success" => true,
                    "user" => $user
                ));
            } else {
                return json_encode(array(
                    "success" => false,
                    "message" => "User not found"
                ));
            }
        } catch (Exception $e) {
            return json_encode(array(
                "success" => false,
                "message" => "Error: " . $e->getMessage()
            ));
        }
    }
    
    // Upload profile picture
    public function uploadProfilePicture($userId, $imageData) {
        try {
            $query = "UPDATE users SET profile_picture = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$imageData, $userId]);
            
            if ($stmt->rowCount() > 0) {
                return json_encode(array(
                    "success" => true,
                    "message" => "Profile picture updated successfully"
                ));
            } else {
                return json_encode(array(
                    "success" => false,
                    "message" => "Failed to update profile picture"
                ));
            }
        } catch (Exception $e) {
            return json_encode(array(
                "success" => false,
                "message" => "Error: " . $e->getMessage()
            ));
        }
    }


}