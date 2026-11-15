<?php
// ============================================================
//  MRMS MART v3.0 (PRO E-COMMERCE & API EDITION) — config.php
//  PHP 8.2+ / 8.3+ Secure Configuration
// ============================================================

declare(strict_types=1);

// ── Database Configuration ────────────────────────────────
define('DB_HOST',    'localhost');
define('DB_NAME',    'mrms6679_mrms');   // আপনার ডাটাবেস নাম
define('DB_USER',    'mrms6679_mrms');   // আপনার ডাটাবেস ইউজার
define('DB_PASS',    'Shadin@111');      // আপনার ডাটাবেস পাসওয়ার্ড (কাজ শেষে পরিবর্তন করে নেবেন)
define('DB_CHARSET', 'utf8mb4');

// ── Admin Dashboard Login (এখানেই আপনার অ্যাডমিন লগইন তথ্য) ──
define('ADMIN_USER', 'admin');           // ← অ্যাডমিন ইউজারনেম
define('ADMIN_PASS', '1234');            // ← অ্যাডমিন পাসওয়ার্ড

// ── Master API Key (অ্যাডমিন ও সিস্টেমের নিজস্ব কাজের জন্য) ──
define('MASTER_API_KEY', 'MRMS8HS2');

// ── Site Information ──────────────────────────────────────
define('SITE_NAME', 'MRMS Mart');
define('SITE_URL',  'https://mrmsmart.bdz1.top'); // শেষে কোনো স্ল্যাশ (/) দেবেন না
define('CURRENCY',  '৳');                         // টাকার সিম্বল (চাইলে $ দিতে পারেন)

// ── Security & Session Settings (PHP 8.2+ Hardened) ───────
date_default_timezone_set('Asia/Dhaka');

$isApiScript = str_ends_with((string)($_SERVER['SCRIPT_NAME'] ?? ''), 'api.php');
$isStatelessApi = $isApiScript && (!empty($_SERVER['PATH_INFO']) || !empty($_GET['api_key']) || !empty($_GET['key']) || !empty($_SERVER['HTTP_X_API_KEY']) || (!empty($_SERVER['QUERY_STRING']) && !str_contains((string)$_SERVER['QUERY_STRING'], '=')));
if (!$isStatelessApi && session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        ini_set('session.cookie_secure', '1');
    }
    session_start();
}