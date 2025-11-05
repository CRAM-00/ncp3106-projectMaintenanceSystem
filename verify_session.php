<?php
header('Content-Type: application/json');
include 'connection.php';

$email = $_POST['email'] ?? '';
$token = $_POST['token'] ?? '';

if (empty($email) || empty($token)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing credentials.']);
    exit;
}

$stmt = $conn->prepare("SELECT session_token FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'User not found.']);
    exit;
}

$user = $result->fetch_assoc();

// ✅ Compare stored token vs sent token
if ($user['session_token'] !== $token) {
    echo json_encode(['status' => 'invalid', 'message' => 'Logged in on another device.']);
} else {
    echo json_encode(['status' => 'valid']);
}

$conn->close();
?>
