<?php
header('Content-Type: application/json');
include 'connection.php';

$title = $_POST['title'] ?? '';
$desc = $_POST['desc'] ?? '';

if (empty($title) || empty($desc)) {
  echo json_encode(['status' => 'error', 'message' => 'Please fill in all fields.']);
  exit;
}

$stmt = $conn->prepare("INSERT INTO announcements (title, description) VALUES (?, ?)");
$stmt->bind_param("ss", $title, $desc);

if ($stmt->execute()) {
  echo json_encode(['status' => 'success']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Failed to save announcement.']);
}

$stmt->close();
$conn->close();
?>
