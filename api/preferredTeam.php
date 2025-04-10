<?php
// Include your database connection file and model
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/Prefers.php';

// Check if the user is authenticated
session_start();
if(empty($_SESSION['valid'])){
    header('Location: login.php');
    http_response_code(405);
}
$_SESSION['user_id'] = $user_id; // Store the user ID in the session
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not authenticated"]);
    exit;
}

 // Retrieve the user ID from the session (or JWT)

try {
    // Initialize the database connection
    // Get database connection
    $database = new Database();
    $db = $database->getConnection();

    // Create the Prefers model and get the preferred team for the user
    $prefers = new Prefers($dbConnection);
    $preferredTeam = $prefers->getPreferredTeamByUserId($userId);

    if ($preferredTeam) {
        // Return the preferred team in JSON format
        echo json_encode(["team_id" => $preferredTeam['team_id']]);
    } else {
        echo json_encode(["error" => "No preferred team found"]);
    }

    $dbConnection->close();
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
