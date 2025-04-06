<?php

class Database {
    // private $host = "mysql.cise.ufl.edu";
    // private $db_name = "BallerzOnly";
    // private $username = "jonathan.jones1";
    // private $password = "SeniorC1tiz3ns";
    private $host = "localhost";
    private $db_name = "auth_db";
    private $username = "root";
    private $password = "";
    private $conn;

    // Database connection
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }

        return $this->conn;
    }
}