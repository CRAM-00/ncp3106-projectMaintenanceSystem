<?php
header('Content-Type: application/json');
include 'connection.php';

$result = $conn->query("SELECT * FROM reports ORDER BY id DESC");
$reports = [];

while ($row = $result->fetch_assoc()) {
    // Rename to match your JS expectations
    $reports[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'building' => $row['building_name'],
        'facility_type' => $row['facility_type'],
        'floor' => $row['floor'],
        'room' => $row['room_number'],
        'description' => $row['description'],
        'status' => $row['status'] ?? 'Pending',
        'image' => $row['file_data'] ? 'data:image/jpeg;base64,' . base64_encode($row['file_data']) : null,
        'complainant_email' => $row['reporter_name'] ?? 'Unknown',
        'date_submitted' => $row['date_submitted'] ?? '',
    ];
}

echo json_encode($reports);
$conn->close();
?>
