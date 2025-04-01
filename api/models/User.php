<?php
class User {
    private $conn;
    private $table_name = "users";

    // User properties
    public $id;
    public $name;
    public $email;
    public $password;
    public $created_at;

    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new user (signup)
    public function create() {
        // Sanitize user input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        
        // Check if email already exists
        if ($this->emailExists()) {
            return false;
        }

        // Insert query
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name = :name,
                    email = :email,
                    password = :password,
                    created_at = :created_at";

        // Prepare query
        $stmt = $this->conn->prepare($query);

        // Hash the password
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $password_hash);
        
        // Get current timestamp
        $this->created_at = date('Y-m-d H:i:s');
        $stmt->bindParam(":created_at", $this->created_at);

        // Execute query
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Check if email exists
    public function emailExists() {
        // Query to check if email exists
        $query = "SELECT id, name, password
                FROM " . $this->table_name . "
                WHERE email = ?
                LIMIT 0,1";

        // Prepare the query
        $stmt = $this->conn->prepare($query);

        // Bind the email
        $stmt->bindParam(1, $this->email);

        // Execute the query
        $stmt->execute();

        // Get row count
        $num = $stmt->rowCount();

        // If email exists, assign values to object properties for easy access
        if ($num > 0) {
            // Get record details
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // Assign values to object properties
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->password = $row['password'];

            return true;
        }

        return false;
    }

    // Get user by ID
    public function getById($id) {
        // Query to get user by ID
        $query = "SELECT id, name, email, created_at
                FROM " . $this->table_name . "
                WHERE id = ?
                LIMIT 0,1";

        // Prepare the query
        $stmt = $this->conn->prepare($query);

        // Bind the ID
        $stmt->bindParam(1, $id);

        // Execute the query
        $stmt->execute();

        // Get row count
        $num = $stmt->rowCount();

        if ($num > 0) {
            // Get record details
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // Assign values to object properties
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->created_at = $row['created_at'];

            return true;
        }

        return false;
    }
}