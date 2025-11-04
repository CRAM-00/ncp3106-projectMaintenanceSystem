<?php
header('Content-Type: application/json');
include 'connection.php';

$title = $_POST['title'] ?? '';
$building = $_POST['building'] ?? '';
$facility = $_POST['facility'] ?? '';
$floor = $_POST['floor'] ?? '';
$room = $_POST['room'] ?? '';
$desc = $_POST['description'] ?? '';
$name = $_POST['name'] ?? 'Unknown';
$fileName = $_FILES['file']['name'] ?? null;
$fileData = null;

if (!$title || !$building || !$desc) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill all required fields.']);
    exit;
}

if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $fileData = file_get_contents($_FILES['file']['tmp_name']);
}

$stmt = $conn->prepare("INSERT INTO reports (title, building_name, facility_type, floor, room_number, description, file_name, file_data, reporter_name)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssss", $title, $building, $facility, $floor, $room, $desc, $fileName, $fileData, $name);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Report submitted successfully!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to save report.']);
}

$stmt->close();
$conn->close();
?>
