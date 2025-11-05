<?php
header('Content-Type: application/json');
include 'connection.php';

$title = $_POST['title'] ?? '';
$building = $_POST['building'] ?? '';
$facility = $_POST['facilityType'] ?? '';
$floor = $_POST['floor'] ?? '';
$room = $_POST['room'] ?? '';
$desc = $_POST['description'] ?? '';
$name = $_POST['name'] ?? 'Unknown';
$imageData = $_POST['imageData'] ?? ''; // ✅ Base64 from JS
$fileName = $imageData ? 'uploaded_image.jpg' : null;
$fileData = null;

// Decode Base64 image if available
if (!empty($imageData)) {
    $imageData = preg_replace('#^data:image/\w+;base64,#i', '', $imageData);
    $fileData = base64_decode($imageData);
}

if (!$title || !$building || !$desc) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill all required fields.']);
    exit;
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
