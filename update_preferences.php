<?php
include 'connection.php';
header('Content-Type: application/json');

$email = $_POST['email'] ?? '';
$darkMode = $_POST['dark_mode'] ?? null;

if (!$email) {
  echo json_encode(['status' => 'error', 'message' => 'Missing email.']);
  exit;
}

if ($darkMode !== null) {
  $stmt = $conn->prepare("UPDATE users SET dark_mode=? WHERE email=?");
  $stmt->bind_param("ss", $darkMode, $email);
  $stmt->execute();
  $stmt->close();
}

echo json_encode(['status' => 'success']);
$conn->close();
?>
