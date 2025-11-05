<?php
header('Content-Type: application/json');
include 'connection.php';

$id = $_POST['id'] ?? '';

if (empty($id)) {
  echo json_encode(['status' => 'error', 'message' => 'Missing announcement ID.']);
  exit;
}

$stmt = $conn->prepare("DELETE FROM announcements WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo json_encode(['status' => 'success']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Failed to delete announcement.']);
}

$stmt->close();
$conn->close();
?>
