<?php
header('Content-Type: application/json');
include 'connection.php';

// Enable visible error output for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

$id = $_POST['id'] ?? '';
$status = $_POST['status'] ?? '';

if (empty($id) || empty($status)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing parameters', 'id' => $id, 'status' => $status]);
    exit;
}

// Check if ID exists in DB
$check = $conn->prepare("SELECT id, status FROM reports WHERE id = ?");
$check->bind_param("i", $id);
$check->execute();
$check->store_result();

if ($check->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => "No report found with ID $id"]);
    exit;
}
$check->close();

// Update the status column
$stmt = $conn->prepare("UPDATE reports SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => "Report #$id updated to $status"]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'SQL update failed', 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
