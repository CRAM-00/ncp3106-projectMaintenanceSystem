<?php
header('Content-Type: application/json');
include 'connection.php';

$email = $_POST['loginEmail'] ?? '';
$password = $_POST['loginPassword'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all fields.']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Account not found.']);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Incorrect password.']);
    exit;
}

// ✅ Generate a new unique session token for this device
$sessionToken = bin2hex(random_bytes(32)); // secure random token

// ✅ Save it to the database
$update = $conn->prepare("UPDATE users SET session_token = ? WHERE email = ?");
$update->bind_param("ss", $sessionToken, $email);
$update->execute();

// ✅ Return token + user data
$response = [
  'status' => 'success',
  'role' => $user['role'],
  'first_name' => $user['first_name'],
  'last_name' => $user['last_name'],
  'name' => $user['first_name'] . ' ' . $user['last_name'],
  'dark_mode' => $user['dark_mode'],
  'profile_pic' => $user['profile_pic'] ? 'data:image/jpeg;base64,' . base64_encode($user['profile_pic']) : null,
  'session_token' => $sessionToken // 👈 return the token to browser
];

echo json_encode($response);
$conn->close();
?>
