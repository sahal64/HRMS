<?php
// Automated setup script: creates database, tables, and seeds initial data
header("Content-Type: application/json; charset=UTF-8");

$host = '127.0.0.1';
$username = 'root';
$password = '';

try {
    // 1. Connect without db to create database if not exists
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `hrms_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `hrms_db`;");

    // 2. Create tables
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `organizations` (
            `id` VARCHAR(50) PRIMARY KEY,
            `name` VARCHAR(255) NOT NULL,
            `code` VARCHAR(20) NOT NULL,
            `industry` VARCHAR(100) NULL,
            `currency` VARCHAR(10) DEFAULT 'USD',
            `currency_symbol` VARCHAR(5) DEFAULT '$',
            `timezone` VARCHAR(50) DEFAULT 'UTC',
            `contact_email` VARCHAR(100) NULL,
            `contact_phone` VARCHAR(50) NULL,
            `website` VARCHAR(255) NULL,
            `tax_id` VARCHAR(100) NULL,
            `daily_work_hours` DECIMAL(4,2) DEFAULT 8.0,
            `default_probation_months` INT DEFAULT 3,
            `enable_geofencing` TINYINT(1) DEFAULT 1,
            `enable_overtime` TINYINT(1) DEFAULT 1,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;

        CREATE TABLE IF NOT EXISTS `departments` (
            `id` VARCHAR(50) PRIMARY KEY,
            `organization_id` VARCHAR(50) NOT NULL,
            `name` VARCHAR(150) NOT NULL,
            `code` VARCHAR(20) NOT NULL,
            `budget` DECIMAL(12,2) DEFAULT 0,
            `employee_count` INT DEFAULT 0,
            `description` TEXT NULL,
            FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB;

        CREATE TABLE IF NOT EXISTS `employees` (
            `id` VARCHAR(50) PRIMARY KEY,
            `organization_id` VARCHAR(50) NOT NULL,
            `employee_code` VARCHAR(50) NOT NULL,
            `first_name` VARCHAR(100) NOT NULL,
            `last_name` VARCHAR(100) NOT NULL,
            `full_name` VARCHAR(200) NOT NULL,
            `email` VARCHAR(150) NOT NULL UNIQUE,
            `phone` VARCHAR(50) NULL,
            `avatar` TEXT NULL,
            `department_id` VARCHAR(50) NOT NULL,
            `department_name` VARCHAR(150) NOT NULL,
            `designation` VARCHAR(150) NOT NULL,
            `joining_date` DATE NOT NULL,
            `birth_date` DATE NOT NULL,
            `employment_type` VARCHAR(50) DEFAULT 'full_time',
            `status` VARCHAR(50) DEFAULT 'active',
            `basic_salary` DECIMAL(10,2) DEFAULT 0,
            `allowances` DECIMAL(10,2) DEFAULT 0,
            `gross_salary` DECIMAL(10,2) DEFAULT 0,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB;

        CREATE TABLE IF NOT EXISTS `attendance_records` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `organization_id` VARCHAR(50) NOT NULL,
            `employee_id` VARCHAR(50) NOT NULL,
            `employee_name` VARCHAR(200) NOT NULL,
            `employee_avatar` TEXT NULL,
            `department` VARCHAR(150) NOT NULL,
            `date` DATE NOT NULL,
            `check_in` VARCHAR(20) NULL,
            `check_out` VARCHAR(20) NULL,
            `work_hours` VARCHAR(50) DEFAULT 'In Progress',
            `status` ENUM('present', 'late', 'absent', 'on_leave', 'half_day') DEFAULT 'present',
            `notes` TEXT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX(`date`),
            FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB;

        CREATE TABLE IF NOT EXISTS `leave_requests` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `organization_id` VARCHAR(50) NOT NULL,
            `employee_id` VARCHAR(50) NOT NULL,
            `employee_name` VARCHAR(200) NOT NULL,
            `employee_avatar` TEXT NULL,
            `department` VARCHAR(150) NOT NULL,
            `leave_type` VARCHAR(50) NOT NULL,
            `start_date` DATE NOT NULL,
            `end_date` DATE NOT NULL,
            `total_days` INT NOT NULL,
            `reason` TEXT NOT NULL,
            `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB;

        CREATE TABLE IF NOT EXISTS `celebration_events` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `organization_id` VARCHAR(50) NOT NULL,
            `employee_id` VARCHAR(50) NOT NULL,
            `employee_name` VARCHAR(200) NOT NULL,
            `employee_avatar` TEXT NULL,
            `department` VARCHAR(150) NOT NULL,
            `type` ENUM('birthday', 'anniversary') NOT NULL,
            `event_date` VARCHAR(10) NOT NULL, -- MM-DD format e.g. 11-21
            `display_date` VARCHAR(20) NOT NULL, -- e.g. Nov 21
            `years_milestone` INT NULL,
            `wishes_sent` TINYINT(1) DEFAULT 0,
            FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    // 3. Seed Initial Organization if empty
    $check = $pdo->query("SELECT COUNT(*) FROM `organizations`")->fetchColumn();
    if ($check == 0) {
        $pdo->exec("
            INSERT INTO `organizations` 
            (`id`, `name`, `code`, `industry`, `currency`, `currency_symbol`, `timezone`, `contact_email`, `contact_phone`, `website`, `tax_id`) 
            VALUES 
            ('org-osforh', 'OSFORH Software Solutions', 'OSF', 'Enterprise Software & IT Solutions', 'USD', '$', 'Asia/Dubai (UTC+4)', 'contact@osforh.com', '+971 4 398 2100', 'https://osforh.com', 'AE-TRN-100482910300003');

            INSERT INTO `departments` (`id`, `organization_id`, `name`, `code`, `budget`, `employee_count`, `description`) VALUES
            ('dept-osf-eng', 'org-osforh', 'Software Engineering', 'ENG', 450000, 58, 'Product engineering & full stack teams'),
            ('dept-osf-prod', 'org-osforh', 'Product & Design', 'PRD', 220000, 24, 'UI/UX and product discovery squads'),
            ('dept-osf-hr', 'org-osforh', 'Human Resources & Talent', 'HRT', 150000, 14, 'People operations, recruiting and culture'),
            ('dept-osf-sales', 'org-osforh', 'Enterprise Sales & Growth', 'SLS', 310000, 30, 'Enterprise accounts & customer success'),
            ('dept-osf-fin', 'org-osforh', 'Finance & Compliance', 'FIN', 120000, 16, 'Financial controllership & audit');

            INSERT INTO `employees` (`id`, `organization_id`, `employee_code`, `first_name`, `last_name`, `full_name`, `email`, `phone`, `avatar`, `department_id`, `department_name`, `designation`, `joining_date`, `birth_date`, `basic_salary`, `allowances`, `gross_salary`) VALUES
            ('emp-osf-001', 'org-osforh', 'OSF-1001', 'Tariq', 'Mansour', 'Tariq Mansour', 'tariq.mansour@osforh.com', '+971 50 123 4567', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'dept-osf-eng', 'Software Engineering', 'VP of Engineering', '2021-03-15', '1985-11-25', 12000, 4500, 16500),
            ('emp-osf-002', 'org-osforh', 'OSF-1002', 'Sarah', 'Al-Hashemi', 'Sarah Al-Hashemi', 'sarah.hashemi@osforh.com', '+971 55 987 6543', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'dept-osf-hr', 'Human Resources & Talent', 'Head of People Operations', '2022-01-10', '1989-11-20', 9500, 3500, 13000),
            ('emp-osf-003', 'org-osforh', 'OSF-1003', 'Zayd', 'Kareem', 'Zayd Kareem', 'zayd.kareem@osforh.com', '+971 52 444 7788', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'dept-osf-prod', 'Product & Design', 'Principal Product Manager', '2022-06-01', '1992-04-14', 8000, 3000, 11000),
            ('emp-osf-004', 'org-osforh', 'OSF-1004', 'Amira', 'Nasser', 'Amira Nasser', 'amira.nasser@osforh.com', '+20 100 234 5678', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'dept-osf-eng', 'Software Engineering', 'Senior Full Stack Lead', '2023-02-15', '1994-11-23', 6500, 2000, 8500),
            ('emp-osf-005', 'org-osforh', 'OSF-1005', 'Karim', 'Fawzy', 'Karim Fawzy', 'karim.fawzy@osforh.com', '+971 50 888 3344', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'dept-osf-fin', 'Finance & Compliance', 'Senior Financial Controller', '2021-11-01', '1987-08-19', 7200, 2800, 10000),
            ('emp-osf-006', 'org-osforh', 'OSF-1006', 'Elena', 'Rostova', 'Elena Rostova', 'elena.rostova@osforh.com', '+971 54 222 9988', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'dept-osf-prod', 'Product & Design', 'Senior UI/UX Designer', '2023-07-01', '1995-11-21', 5500, 2000, 7500);

            -- Initial Attendance
            INSERT INTO `attendance_records` (`organization_id`, `employee_id`, `employee_name`, `employee_avatar`, `department`, `date`, `check_in`, `check_out`, `work_hours`, `status`) VALUES
            ('org-osforh', 'emp-osf-001', 'Tariq Mansour', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Software Engineering', CURRENT_DATE(), '08:55 AM', '05:45 PM', '8h 50m', 'present'),
            ('org-osforh', 'emp-osf-002', 'Sarah Al-Hashemi', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'Human Resources & Talent', CURRENT_DATE(), '09:02 AM', NULL, 'In Progress', 'present'),
            ('org-osforh', 'emp-osf-003', 'Zayd Kareem', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Product & Design', CURRENT_DATE(), '09:42 AM', NULL, 'In Progress', 'late'),
            ('org-osforh', 'emp-osf-004', 'Amira Nasser', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'Software Engineering', CURRENT_DATE(), NULL, NULL, '0h', 'on_leave'),
            ('org-osforh', 'emp-osf-006', 'Elena Rostova', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Product & Design', CURRENT_DATE(), '08:48 AM', NULL, 'In Progress', 'present');

            -- Initial Leave Requests
            INSERT INTO `leave_requests` (`organization_id`, `employee_id`, `employee_name`, `employee_avatar`, `department`, `leave_type`, `start_date`, `end_date`, `total_days`, `reason`, `status`) VALUES
            ('org-osforh', 'emp-osf-004', 'Amira Nasser', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'Software Engineering', 'annual', '2026-12-01', '2026-12-03', 3, 'Family trip & vacation', 'pending'),
            ('org-osforh', 'emp-osf-003', 'Zayd Kareem', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Product & Design', 'casual', '2026-11-26', '2026-11-26', 1, 'Personal emergency', 'approved');

            -- Initial Celebrations (including Elena's birthday for the 2-day alert!)
            INSERT INTO `celebration_events` (`organization_id`, `employee_id`, `employee_name`, `employee_avatar`, `department`, `type`, `event_date`, `display_date`, `years_milestone`, `wishes_sent`) VALUES
            ('org-osforh', 'emp-osf-006', 'Elena Rostova', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Product & Design', 'birthday', '11-21', 'Nov 21', NULL, 0),
            ('org-osforh', 'emp-osf-004', 'Amira Nasser', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'Software Engineering', 'birthday', '11-23', 'Nov 23', NULL, 0),
            ('org-osforh', 'emp-osf-001', 'Tariq Mansour', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Software Engineering', 'anniversary', '11-25', 'Nov 25', 3, 0);
        ");
    }

    echo json_encode([
        'success' => true,
        'message' => 'Database `hrms_db` and tables created and seeded successfully!'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
