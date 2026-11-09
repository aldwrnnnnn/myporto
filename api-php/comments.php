<?php
/**
 * Public Comments / Guestbook API Endpoint
 * Handles fetching and posting comments with persistent JSON storage.
 */

declare(strict_types=1);

// Set timezone to Western Indonesia Time (WIB)
date_default_timezone_set('Asia/Jakarta');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-cache, no-store, must-revalidate');

$dataFile = __DIR__ . '/comments.json';

// Initialize data file if it does not exist
if (!file_exists($dataFile)) {
    @file_put_contents($dataFile, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

/**
 * Load all comments safely from storage
 * @return array
 */
function loadComments(string $path): array {
    if (!file_exists($path)) {
        return [];
    }
    $raw = @file_get_contents($path);
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Save comments array to storage with atomic file locking
 */
function saveComments(string $path, array $comments): bool {
    $encoded = json_encode($comments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return @file_put_contents($path, $encoded, LOCK_EX) !== false;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $comments = loadComments($dataFile);
    echo json_encode([
        'success' => true,
        'count' => count($comments),
        'comments' => $comments
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    // Read input data from raw body (JSON) or $_POST
    $rawInput = file_get_contents('php://input');
    $inputData = json_decode($rawInput, true);

    if (!is_array($inputData)) {
        $inputData = $_POST;
    }

    $rawName = isset($inputData['name']) ? trim((string)$inputData['name']) : '';
    $rawComment = isset($inputData['comment']) ? trim((string)$inputData['comment']) : '';

    // Validate Name (2 - 50 characters)
    $nameLength = mb_strlen($rawName, 'UTF-8');
    if ($nameLength < 2) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Nama wajib diisi minimal 2 karakter.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($nameLength > 50) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Nama maksimal 50 karakter.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Validate Comment (3 - 500 characters)
    $commentLength = mb_strlen($rawComment, 'UTF-8');
    if ($commentLength < 3) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Komentar wajib diisi minimal 3 karakter.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($commentLength > 500) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Komentar maksimal 500 karakter.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Sanitize inputs to prevent XSS while maintaining natural characters
    $cleanName = htmlspecialchars(strip_tags($rawName), ENT_QUOTES, 'UTF-8');
    $cleanComment = htmlspecialchars(strip_tags($rawComment), ENT_QUOTES, 'UTF-8');

    // Indonesian Month Names
    $monthMap = [
        1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
        5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu',
        9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
    ];
    $monthIndex = (int)date('n');
    $formattedDate = date('j ') . ($monthMap[$monthIndex] ?? date('M')) . date(' Y');

    $newComment = [
        'id' => 'cmt_' . bin2hex(random_bytes(6)),
        'name' => $cleanName,
        'comment' => $cleanComment,
        'created_at' => date('c'),
        'formatted_date' => $formattedDate
    ];

    $comments = loadComments($dataFile);
    
    // Add new comment at the very top (chronological desc)
    array_unshift($comments, $newComment);

    // Keep up to 200 latest comments to prevent unlimited file bloat
    if (count($comments) > 200) {
        $comments = array_slice($comments, 0, 200);
    }

    if (!saveComments($dataFile, $comments)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Gagal menyimpan komentar ke server.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Komentar berhasil dikirim!',
        'comment' => $newComment,
        'comments' => $comments
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Any other method
http_response_code(405);
echo json_encode([
    'success' => false,
    'error' => 'Method not allowed.'
]);
