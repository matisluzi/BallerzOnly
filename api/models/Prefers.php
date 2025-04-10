<?php
class Prefers {
    private $conn;

    // Constructor to initialize database connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Get a user's preferred team by user ID
    public function getPreferredTeamByUserId($userId) {
        $query = "SELECT team_id FROM prefers WHERE user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            return $result->fetch_assoc(); // Return the preferred team
        } else {
            return null; // No preference found
        }
    }

    // methods to insert or update preferences ??
}
?>
