<?php
header('Content-Type: application/json');
include 'connection.php';

$result = $conn->query("SELECT * FROM announcements ORDER BY id DESC");
$announcements = [];

while ($row = $result->fetch_assoc()) {
  $announcements[] = [
    'id' => $row['id'],
    'title' => $row['title'],
    'desc' => $row['description'],
    // ✅ ISO format + 24-hour military time
    'date' => date('Y-m-d H:i:s', strtotime($row['date_posted'])),
  ];
}

echo json_encode($announcements);
$conn->close();
?>
