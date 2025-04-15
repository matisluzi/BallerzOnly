<?php
require_once __DIR__ . '/../models/Favorites.php';

class FavoritesController {
    private $db;
    private $favorites;
    
    public function __construct($db) {
        $this->db = $db;
        $this->favorites = new Favorites($db);
    }
    
    // Add a team to favorites
    public function addFavorite($data, $userId) {
        // Required fields validation
        if (empty($data->team_id)) {
            // Set HTTP response code - 400 Bad Request
            http_response_code(400);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "Team ID is required"
            ));
        }
        
        // Set favorite properties
        $this->favorites->user_id = $userId;
        $this->favorites->team_id = $data->team_id;
        
        // Check if already a favorite
        if ($this->favorites->isFavorite()) {
            // Set HTTP response code - 409 Conflict
            http_response_code(409);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "Team already in favorites"
            ));
        }
        
        // Add favorite
        if ($this->favorites->addFavorite()) {
            // Set HTTP response code - 201 Created
            http_response_code(201);
            
            // Response message
            return json_encode(array(
                "success" => true,
                "message" => "Team added to favorites"
            ));
        } else {
            // Set HTTP response code - 500 Internal Server Error
            http_response_code(500);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "Unable to add team to favorites"
            ));
        }
    }
    
    // Remove a team from favorites
    public function removeFavorite($data, $userId) {
        // Required fields validation
        if (empty($data->team_id)) {
            // Set HTTP response code - 400 Bad Request
            http_response_code(400);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "Team ID is required"
            ));
        }
        
        // Set favorite properties
        $this->favorites->user_id = $userId;
        $this->favorites->team_id = $data->team_id;
        
        // Check if it's a favorite
        if (!$this->favorites->isFavorite()) {
            // Set HTTP response code - 404 Not Found
            http_response_code(404);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "Team not found in favorites"
            ));
        }
        
        // Remove favorite
        if ($this->favorites->removeFavorite()) {
            // Set HTTP response code - 200 OK
            http_response_code(200);
            
            // Response message
            return json_encode(array(
                "success" => true,
                "message" => "Team removed from favorites"
            ));
        } else {
            // Set HTTP response code - 500 Internal Server Error
            http_response_code(500);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "Unable to remove team from favorites"
            ));
        }
    }
    
    // Get all favorite teams for a user
    public function getFavorites($userId) {
        // Set user ID
        $this->favorites->user_id = $userId;
        
        // Get favorite teams
        $stmt = $this->favorites->getFavorites();
        
        if ($stmt) {
            // Check if any favorites found
            if ($stmt->rowCount() > 0) {
                // Favorites array
                $favorites_arr = array();
                
                // Fetch all favorites
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $favorites_arr[] = $row['team_id'];
                }
                
                // Set HTTP response code - 200 OK
                http_response_code(200);
                
                // Response message with favorites
                return json_encode(array(
                    "success" => true,
                    "favorites" => $favorites_arr
                ));
            } else {
                // Set HTTP response code - 200 OK
                http_response_code(200);
                
                // No favorites found
                return json_encode(array(
                    "success" => true,
                    "favorites" => array()
                ));
            }
        } else {
            // Set HTTP response code - 500 Internal Server Error
            http_response_code(500);
            
            // Response message
            return json_encode(array(
                "success" => false,
                "message" => "Unable to get favorites"
            ));
        }
    }
    
    // Check if a team is a favorite
    public function checkFavorite($teamId, $userId) {
        // Set favorite properties
        $this->favorites->user_id = $userId;
        $this->favorites->team_id = $teamId;
        
        // Check if it's a favorite
        $isFavorite = $this->favorites->isFavorite();
        
        // Set HTTP response code - 200 OK
        http_response_code(200);
        
        // Response message
        return json_encode(array(
            "success" => true,
            "isFavorite" => $isFavorite
        ));
    }
}