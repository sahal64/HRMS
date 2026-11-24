<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$orgId = $_GET['organizationId'] ?? 'org-osforh';

if ($method === 'GET') {
    // Fetch all leave requests
    $stmt = $pdo->prepare("SELECT * FROM `leave_requests` WHERE `organization_id` = ? ORDER BY `id` DESC");
    $stmt->execute([$orgId]);
    $requests = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $requests
    ]);
} elseif ($method === 'POST') {
    // Apply for new leave
    $input = json_decode(file_get_contents('php://input'), true);

    $employeeId = $input['employeeId'] ?? 'emp-osf-002';
    $employeeName = $input['employeeName'] ?? 'Sarah Al-Hashemi';
    $employeeAvatar = $input['employeeAvatar'] ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    $department = $input['department'] ?? 'Human Resources & Talent';
    $leaveType = $input['leaveType'] ?? 'annual';
    $startDate = $input['startDate'];
    $endDate = $input['endDate'];
    $totalDays = (int)($input['totalDays'] ?? 1);
    $reason = $input['reason'] ?? '';

    $stmt = $pdo->prepare("INSERT INTO `leave_requests` (`organization_id`, `employee_id`, `employee_name`, `employee_avatar`, `department`, `leave_type`, `start_date`, `end_date`, `total_days`, `reason`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
    $stmt->execute([$orgId, $employeeId, $employeeName, $employeeAvatar, $department, $leaveType, $startDate, $endDate, $totalDays, $reason]);

    echo json_encode([
        'success' => true,
        'message' => 'Leave application submitted successfully!',
        'id' => $pdo->lastInsertId()
    ]);
} elseif ($method === 'PATCH') {
    // Approve or Reject leave
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'];
    $status = $input['status']; // 'approved' or 'rejected'

    $stmt = $pdo->prepare("UPDATE `leave_requests` SET `status` = ? WHERE `id` = ?");
    $stmt->execute([$status, $id]);

    echo json_encode([
        'success' => true,
        'message' => "Leave request marked as $status"
    ]);
}
