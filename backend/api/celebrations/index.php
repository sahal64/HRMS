<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$orgId = $_GET['organizationId'] ?? 'org-osforh';

if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT * FROM `celebration_events` WHERE `organization_id` = ?");
    $stmt->execute([$orgId]);
    $events = $stmt->fetchAll();

    // Calculate days remaining dynamically based on today
    $today = new DateTime();
    $currentYear = (int)$today->format('Y');

    foreach ($events as &$event) {
        $parts = explode('-', $event['event_date']); // e.g. "11-21"
        $month = (int)$parts[0];
        $day = (int)$parts[1];

        $targetDate = new DateTime("$currentYear-$month-$day");
        if ($targetDate < $today && $targetDate->format('Y-m-d') !== $today->format('Y-m-d')) {
            // Event has passed this year, look at next year
            $targetDate->modify('+1 year');
        }

        $diff = $today->diff($targetDate);
        $daysRemaining = (int)$diff->days;
        if ($targetDate->format('Y-m-d') === $today->format('Y-m-d')) {
            $daysRemaining = 0;
        }

        $event['daysRemaining'] = $daysRemaining;
        $event['isUrgent2Days'] = ($daysRemaining <= 2);
    }

    echo json_encode([
        'success' => true,
        'data' => $events
    ]);
} elseif ($method === 'POST') {
    // Mark wishes sent
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'];

    $stmt = $pdo->prepare("UPDATE `celebration_events` SET `wishes_sent` = 1 WHERE `id` = ?");
    $stmt->execute([$id]);

    echo json_encode([
        'success' => true,
        'message' => 'Celebration greeting recorded and dispatched!'
    ]);
}
