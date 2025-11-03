<?php
$servername = "localhost";
$username = "root";
$password = ""; // default in XAMPP
$dbname = "ue_system";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}
?>
