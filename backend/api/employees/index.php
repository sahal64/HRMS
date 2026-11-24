<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$orgId = $_GET['organizationId'] ?? 'org-osforh';

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($method === 'GET') {
    $search = trim($_GET['q'] ?? '');
    $dept = trim($_GET['departmentId'] ?? '');

    $sql = "SELECT * FROM `employees` WHERE `organization_id` = ?";
    $params = [$orgId];

    if (!empty($dept) && $dept !== 'all') {
        $sql .= " AND (`department_id` = ? OR `department_name` = ?)";
        $params[] = $dept;
        $params[] = $dept;
    }

    if (!empty($search)) {
        $sql .= " AND (`full_name` LIKE ? OR `email` LIKE ? OR `designation` LIKE ? OR `employee_code` LIKE ?)";
        $term = "%$search%";
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
    }

    $sql .= " ORDER BY `id` ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $employees = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'count' => count($employees),
        'data' => $employees
    ]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $firstName = trim($input['firstName'] ?? '');
    $lastName = trim($input['lastName'] ?? '');
    $fullName = trim($input['fullName'] ?? "$firstName $lastName");
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $emergencyName = trim($input['emergencyContactName'] ?? '');
    $emergencyPhone = trim($input['emergencyContactPhone'] ?? '');
    $address = trim($input['address'] ?? '');
    $departmentId = trim($input['departmentId'] ?? 'dept-osf-eng');
    $departmentName = trim($input['departmentName'] ?? 'Software Engineering');
    $designation = trim($input['designation'] ?? 'Staff Member');
    $joiningDate = trim($input['joiningDate'] ?? date('Y-m-d'));
    $birthDate = trim($input['birthDate'] ?? '1995-01-01');
    $endDate = !empty($input['endDate']) ? trim($input['endDate']) : null;
    $employmentType = trim($input['employmentType'] ?? 'full_time');
    $status = trim($input['status'] ?? 'active');
    $basicSalary = floatval($input['basicSalary'] ?? 0);
    $allowances = floatval($input['allowances'] ?? 0);
    $grossSalary = floatval($input['grossSalary'] ?? ($basicSalary + $allowances));
    $avatar = trim($input['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

    if (empty($fullName) || empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Full Name and Email are required.']);
        exit();
    }

    // Auto-generate employee code
    $count = $pdo->query("SELECT COUNT(*) FROM `employees` WHERE `organization_id` = '$orgId'")->fetchColumn();
    $empCode = "OSF-" . str_pad($count + 1001, 4, '0', STR_PAD_LEFT);
    $empId = "emp-osf-" . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

    $stmt = $pdo->prepare("
        INSERT INTO `employees` (
            `id`, `organization_id`, `employee_code`, `first_name`, `last_name`, `full_name`,
            `email`, `phone`, `emergency_contact_name`, `emergency_contact_phone`, `address`,
            `avatar`, `department_id`, `department_name`, `designation`, `joining_date`,
            `birth_date`, `end_date`, `employment_type`, `status`, `basic_salary`, `allowances`, `gross_salary`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $empId, $orgId, $empCode, $firstName, $lastName, $fullName,
        $email, $phone, $emergencyName, $emergencyPhone, $address,
        $avatar, $departmentId, $departmentName, $designation, $joiningDate,
        $birthDate, $endDate, $employmentType, $status, $basicSalary, $allowances, $grossSalary
    ]);

    // Automatically sync Birthday to celebration_events table if birth_date is provided
    if (!empty($birthDate)) {
        $bDateObj = new DateTime($birthDate);
        $eventDate = $bDateObj->format('m-d');
        $displayDate = $bDateObj->format('M d');

        $bStmt = $pdo->prepare("
            INSERT INTO `celebration_events` (
                `organization_id`, `employee_id`, `employee_name`, `employee_avatar`,
                `department`, `type`, `event_date`, `display_date`, `wishes_sent`
            ) VALUES (?, ?, ?, ?, ?, 'birthday', ?, ?, 0)
        ");
        $bStmt->execute([$orgId, $empId, $fullName, $avatar, $departmentName, $eventDate, $displayDate]);
    }

    echo json_encode([
        'success' => true,
        'message' => "Employee $fullName onboarded successfully!",
        'data' => [
            'id' => $empId,
            'employeeCode' => $empCode,
            'fullName' => $fullName,
            'email' => $email,
            'departmentName' => $departmentName,
            'designation' => $designation,
            'joiningDate' => $joiningDate,
            'birthDate' => $birthDate,
            'endDate' => $endDate,
            'phone' => $phone,
            'emergencyContactName' => $emergencyName,
            'emergencyContactPhone' => $emergencyPhone,
            'grossSalary' => $grossSalary,
            'status' => $status
        ]
    ]);
    exit();
}

if ($method === 'PATCH' || $method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Employee ID is required.']);
        exit();
    }

    $fields = [];
    $params = [];

    $updatable = [
        'full_name' => 'fullName',
        'email' => 'email',
        'phone' => 'phone',
        'emergency_contact_name' => 'emergencyContactName',
        'emergency_contact_phone' => 'emergencyContactPhone',
        'address' => 'address',
        'designation' => 'designation',
        'department_name' => 'departmentName',
        'joining_date' => 'joiningDate',
        'birth_date' => 'birthDate',
        'end_date' => 'endDate',
        'status' => 'status',
        'basic_salary' => 'basicSalary',
        'allowances' => 'allowances',
        'gross_salary' => 'grossSalary',
    ];

    foreach ($updatable as $col => $key) {
        if (isset($input[$key])) {
            $fields[] = "`$col` = ?";
            $params[] = $input[$key];
        }
    }

    if (empty($fields)) {
        echo json_encode(['success' => true, 'message' => 'No changes submitted.']);
        exit();
    }

    $params[] = $id;
    $sql = "UPDATE `employees` SET " . implode(', ', $fields) . " WHERE `id` = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode([
        'success' => true,
        'message' => 'Employee details updated successfully!'
    ]);
    exit();
}

if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? ($_GET['id'] ?? null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Employee ID required.']);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM `employees` WHERE `id` = ?");
    $stmt->execute([$id]);

    echo json_encode([
        'success' => true,
        'message' => 'Employee record deleted.'
    ]);
    exit();
}
