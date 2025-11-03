<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "ue_system");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// Get POST data safely
$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$email = trim($_POST['signupEmail'] ?? '');
$passwordPlain = $_POST['signupPassword'] ?? '';
$role = trim($_POST['signupRole'] ?? '');

// ✅ Check required fields
if (empty($firstName) || empty($lastName) || empty($email) || empty($passwordPlain) || empty($role)) {
    echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
    exit;
}

// ✅ Enforce @ue.edu.ph domain (case-insensitive)
if (!preg_match('/^[A-Z0-9._%+-]+@ue\.edu\.ph$/i', $email)) {
    echo json_encode([
        "status" => "error",
        "message" => "Only @ue.edu.ph email addresses are allowed for registration."
    ]);
    exit;
}

$password = password_hash($passwordPlain, PASSWORD_DEFAULT);

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered."]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $firstName, $lastName, $email, $password, $role);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Account created successfully.",
        "first_name" => $firstName,
        "last_name" => $lastName,
        "role" => $role
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Something went wrong while saving user."]);
}

$stmt->close();
$conn->close();
?>
