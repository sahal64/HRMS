<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$orgId = $_GET['organizationId'] ?? 'org-osforh';

if ($method === 'GET') {
    // List attendance records
    $stmt = $pdo->prepare("SELECT * FROM `attendance_records` WHERE `organization_id` = ? ORDER BY `date` DESC, `id` DESC LIMIT 100");
    $stmt->execute([$orgId]);
    $records = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $records
    ]);
} elseif ($method === 'POST') {
    // Punch In / Punch Out
    $input = json_decode(file_get_contents('php://input'), true);
    
    $employeeId = $input['employeeId'] ?? 'emp-osf-002';
    $employeeName = $input['employeeName'] ?? 'Sarah Al-Hashemi';
    $employeeAvatar = $input['employeeAvatar'] ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    $department = $input['department'] ?? 'Human Resources & Talent';
    $date = date('Y-m-d');
    $timeNow = date('h:i A');

    // Check if record exists for today
    $check = $pdo->prepare("SELECT * FROM `attendance_records` WHERE `employee_id` = ? AND `date` = ?");
    $check->execute([$employeeId, $date]);
    $existing = $check->fetch();

    if ($existing) {
        // Punch Out
        $update = $pdo->prepare("UPDATE `attendance_records` SET `check_out` = ?, `work_hours` = 'Completed' WHERE `id` = ?");
        $update->execute([$timeNow, $existing['id']]);
        echo json_encode([
            'success' => true,
            'action' => 'punch_out',
            'message' => "Clocked out successfully at $timeNow"
        ]);
    } else {
        // Punch In
        $insert = $pdo->prepare("INSERT INTO `attendance_records` (`organization_id`, `employee_id`, `employee_name`, `employee_avatar`, `department`, `date`, `check_in`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, 'present')");
        $insert->execute([$orgId, $employeeId, $employeeName, $employeeAvatar, $department, $date, $timeNow]);
        echo json_encode([
            'success' => true,
            'action' => 'punch_in',
            'message' => "Clocked in successfully at $timeNow"
        ]);
    }
}
