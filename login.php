<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'connection.php'; // ensure this points to your DB connection

$email = $_POST['loginEmail'] ?? '';
$password = $_POST['loginPassword'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all fields.']);
    exit;
}

// Check if user exists
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Account not found.']);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Incorrect password.']);
    exit;
}

// ✅ Return user info
echo json_encode([
    'status' => 'success',
    'first_name' => $user['first_name'],
    'last_name' => $user['last_name'],
    'role' => $user['role'],
    'name' => $user['first_name'] . ' ' . $user['last_name']
]);

$conn->close();
?>
