<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit();
}

// 1. Check if employee exists in database
$stmt = $pdo->prepare("SELECT * FROM `employees` WHERE LOWER(`email`) = LOWER(?) LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

// 2. Demo fallback credentials:
// Sarah Al-Hashemi (HR Manager): sarah.hashemi@osforh.com / admin123
// Master Admin: admin@hrms.com / admin123
$isValid = false;
$userData = null;

if ($user) {
    // For demo/simplicity, accept password 'admin123' or password stored
    if ($password === 'admin123' || (isset($user['password']) && password_verify($password, $user['password']))) {
        $isValid = true;
        $userData = [
            'id' => $user['id'],
            'name' => $user['full_name'],
            'email' => $user['email'],
            'role' => 'hr_manager',
            'department' => $user['department_name'],
            'avatar' => $user['avatar'],
            'organizationId' => $user['organization_id']
        ];
    }
} elseif (strtolower($email) === 'admin@hrms.com' && $password === 'admin123') {
    $isValid = true;
    $userData = [
        'id' => 'emp-osf-002',
        'name' => 'Sarah Al-Hashemi',
        'email' => 'sarah.hashemi@osforh.com',
        'role' => 'hr_manager',
        'department' => 'Human Resources & Talent',
        'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        'organizationId' => 'org-osforh'
    ];
}

if (!$isValid || !$userData) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email or password. Default test credentials: sarah.hashemi@osforh.com / admin123'
    ]);
    exit();
}

// Generate simple auth token
$token = bin2hex(random_bytes(24));

echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'token' => $token,
    'user' => $userData
]);
