<?php
header('Content-Type: application/json');
include 'connection.php';

$result = $conn->query("SELECT * FROM reports ORDER BY id DESC");
$reports = [];

while ($row = $result->fetch_assoc()) {
    $row['file_data'] = $row['file_data']
        ? 'data:image/jpeg;base64,' . base64_encode($row['file_data'])
        : null;
    $reports[] = $row;
}

echo json_encode(['status' => 'success', 'reports' => $reports]);

$conn->close();
?>
