<?php
include 'connection.php';
header('Content-Type: application/json');

$email = $_POST['email'] ?? '';
$imageData = $_POST['imageData'] ?? '';

if (!$email || !$imageData) {
  echo json_encode(['status' => 'error', 'message' => 'Missing email or image data']);
  exit;
}

// Remove base64 prefix (e.g., "data:image/png;base64,")
if (strpos($imageData, 'base64,') !== false) {
  $imageData = explode('base64,', $imageData)[1];
}

$imageData = base64_decode($imageData);

// Save as BLOB to the database
$stmt = $conn->prepare("UPDATE users SET profile_pic = ? WHERE email = ?");
$stmt->bind_param("bs", $null, $email);
$null = null;
$stmt->send_long_data(0, $imageData);

if ($stmt->execute()) {
  echo json_encode(['status' => 'success', 'message' => 'Profile picture updated.']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Database update failed.']);
}

$stmt->close();
$conn->close();
?>
