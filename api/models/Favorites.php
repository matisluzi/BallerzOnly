<?php
class Favorites {
    private $conn;
    private $table_name = "favorites";

    // Table properties
    public $user_id;
    public $team_id;

    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Add a favorite team
    public function addFavorite() {
        // Sanitize user input
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->team_id = htmlspecialchars(strip_tags($this->team_id));

        // Insert query
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    user_id = :user_id,
                    team_id = :team_id";

        // Prepare query
        $stmt = $this->conn->prepare($query);

        // Bind values
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":team_id", $this->team_id);

        // Execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Remove a favorite team
    public function removeFavorite() {
        // Sanitize user input
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->team_id = htmlspecialchars(strip_tags($this->team_id));

        // Delete query
        $query = "DELETE FROM " . $this->table_name . "
                WHERE
                    user_id = :user_id AND team_id = :team_id";

        // Prepare query
        $stmt = $this->conn->prepare($query);

        // Bind values
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":team_id", $this->team_id);

        // Execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Get all favorite teams for a user
    public function getFavorites() {
        // Sanitize user input
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        // Select query
        $query = "SELECT team_id FROM " . $this->table_name . "
                WHERE user_id = :user_id";

        // Prepare query
        $stmt = $this->conn->prepare($query);

        // Bind values
        $stmt->bindParam(":user_id", $this->user_id);

        // Execute query
        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    // Check if a team is already favorited by a user
    public function isFavorite() {
        // Sanitize user input
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->team_id = htmlspecialchars(strip_tags($this->team_id));

        // Select query
        $query = "SELECT COUNT(*) FROM " . $this->table_name . "
                WHERE user_id = :user_id AND team_id = :team_id";

        // Prepare query
        $stmt = $this->conn->prepare($query);

        // Bind values
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":team_id", $this->team_id);

        // Execute query
        if ($stmt->execute()) {
            return $stmt->fetchColumn() > 0;
        }

        return false;
    }

    public function joinFavorite(){
        // Sanitize user input
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->team_id = htmlspecialchars(strip_tags($this->team_id));

        // Join query (join favorites on users)
        $query = "SELECT (*) FROM " . $this->table_name . "
                INNER JOIN user_id on users.user_id = $this->user_id
                WHERE user_id = :user_id AND team_id = :team_id";
        // Prepare query
        $stmt = $this->conn->prepare($query);

        // Bind values
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":team_id", $this->team_id);

        // Execute query
        if ($stmt->execute()) {
            return $stmt;
        }
        return false;
    }
}