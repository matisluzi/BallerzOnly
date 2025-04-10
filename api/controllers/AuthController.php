<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/JwtHandler.php';
session_start();
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
                
                $_SESSION['user_id'] = $this->user->id; // ADDED LINE
                echo "this is ur user id";
                echo $this->user->id;
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
    
    // Get user profile
    public function getProfile($userId) {
        // Get user by ID
        if ($this->user->getById($userId)) {
            // Set HTTP response code - 200 OK
            http_response_code(200);
            
            // Response message with user data
            return json_encode(array(
                "success" => true,
                "user" => array(
                    "id" => $this->user->id,
                    "name" => $this->user->name,
                    "email" => $this->user->email,
                    "created_at" => $this->user->created_at
                )
            ));
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
}