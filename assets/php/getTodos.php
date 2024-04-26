<?php
include 'index.php';

$stmt = $conn->prepare("SELECT * FROM tasks WHERE userName = ?");
$stmt->bind_param("s", $_POST['username']);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
   $data = array();
   while ($row = $result->fetch_assoc()) {
      array_push($data, $row);
   }
   $response['success'] = true;
   $response['todos'] = $data;
} else {
   $response['success'] = false;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);