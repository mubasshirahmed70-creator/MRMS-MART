<?php
// ============================================================
//  MRMS MART v3.1 — db.php
//  PDO Connection, Auto Table Repair & Strict API Auth
// ============================================================

declare(strict_types=1);

require_once __DIR__ . '/config.php';

function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        die(json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]));
    }

    setupTables($pdo);
    return $pdo;
}

function setupTables(PDO $pdo): void {
    static $initialized = false;
    if ($initialized) return;
    $initialized = true;

    // Ultra-Fast Schema Lock: Skip running 25+ DDL/ALTER queries on every single API/page call!
    $lockFile = sys_get_temp_dir() . '/mrms_schema_v64_' . md5(DB_NAME) . '.lock';
    if (file_exists($lockFile) && (time() - (int)@filemtime($lockFile)) < 86400) {
        return;
    }

    // 1. Categories Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categories (
            id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name        VARCHAR(100) NOT NULL,
            slug        VARCHAR(100) NOT NULL UNIQUE,
            icon        MEDIUMTEXT   NOT NULL,
            sort_order  INT          NOT NULL DEFAULT 1,
            status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
            created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    try { $pdo->exec("ALTER TABLE categories MODIFY COLUMN icon MEDIUMTEXT NOT NULL"); } catch (PDOException) {}

    $catCount = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    if ($catCount === 0) {
        $defaultCats = [
            ['Hotmail / Outlook', 'mail', '📧', 1],
            ['Gmail Accounts',    'gmail', '📮', 2],
            ['Residential Proxy', 'proxy', '🌐', 3],
            ['Social Cookies',    'cookie', '🍪', 4],
            ['Cloud RDP / VPS',   'rdp', '🖥️', 5],
        ];
        $stmtCat = $pdo->prepare("INSERT IGNORE INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)");
        foreach ($defaultCats as $c) $stmtCat->execute($c);
    }

    // 2. Products Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name        VARCHAR(150) NOT NULL,
            slug        VARCHAR(150) NOT NULL UNIQUE,
            category    VARCHAR(100) NOT NULL DEFAULT 'mail',
            price       DECIMAL(10,2) NOT NULL DEFAULT 1.00,
            description TEXT         DEFAULT NULL,
            status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
            created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    try { $pdo->exec("ALTER TABLE products ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT 'mail' AFTER slug"); } catch (PDOException) {}
    try { $pdo->exec("ALTER TABLE products ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 1.00 AFTER category"); } catch (PDOException) {}
    try { $pdo->exec("ALTER TABLE products ADD COLUMN full_description TEXT DEFAULT NULL AFTER description"); } catch (PDOException) {}

    // 3. Stock Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS stock (
            id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            product_id  INT UNSIGNED NOT NULL,
            data        TEXT         NOT NULL,
            status      ENUM('available','sold') NOT NULL DEFAULT 'available',
            buyer_id    VARCHAR(50)  DEFAULT NULL,
            order_id    BIGINT UNSIGNED DEFAULT NULL,
            added_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
            sold_at     DATETIME     DEFAULT NULL,
            INDEX idx_product_status (product_id, status),
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    try { $pdo->exec("ALTER TABLE stock ADD COLUMN order_id BIGINT UNSIGNED DEFAULT NULL AFTER buyer_id"); } catch (PDOException) {}
    try { $pdo->exec("DELETE FROM stock WHERE status = 'sold'"); } catch (PDOException) {}

    // 4. Users Table (With Auto-Repair)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name        VARCHAR(100) NOT NULL,
            email       VARCHAR(150) NOT NULL UNIQUE,
            password    VARCHAR(255) NOT NULL,
            balance     DECIMAL(12,2) NOT NULL DEFAULT 0.00,
            api_key     VARCHAR(64)   DEFAULT NULL,
            api_status  ENUM('none','pending','approved','revoked') NOT NULL DEFAULT 'none',
            status      ENUM('active','banned') NOT NULL DEFAULT 'active',
            created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    try { $pdo->exec("ALTER TABLE users ADD COLUMN balance DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER password"); } catch (PDOException) {}
    try { $pdo->exec("ALTER TABLE users ADD COLUMN api_key VARCHAR(64) DEFAULT NULL AFTER balance"); } catch (PDOException) {}
    try { $pdo->exec("ALTER TABLE users ADD COLUMN api_status ENUM('none','pending','approved','revoked') NOT NULL DEFAULT 'none' AFTER api_key"); } catch (PDOException) {}
    try { $pdo->exec("ALTER TABLE users ADD COLUMN status ENUM('active','banned') NOT NULL DEFAULT 'active' AFTER api_status"); } catch (PDOException) {}

    // 5. Orders Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS orders (
            id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            order_code   VARCHAR(32)   NOT NULL UNIQUE,
            user_id      INT UNSIGNED  NOT NULL,
            product_id   INT UNSIGNED  NOT NULL,
            product_name VARCHAR(150)  NOT NULL,
            qty          INT UNSIGNED  NOT NULL DEFAULT 1,
            unit_price   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            total_price  DECIMAL(12,2) NOT NULL DEFAULT 0.00,
            items_data   LONGTEXT      NOT NULL,
            buy_source   ENUM('web','api') NOT NULL DEFAULT 'web',
            created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 6. Deposits Table (With Payment Screenshot Support)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS deposits (
            id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id     INT UNSIGNED  NOT NULL,
            method      VARCHAR(50)   NOT NULL,
            sender_num  VARCHAR(50)   DEFAULT NULL,
            trx_id      VARCHAR(100)  NOT NULL UNIQUE,
            amount      DECIMAL(12,2) NOT NULL,
            screenshot  LONGTEXT      DEFAULT NULL,
            status      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
            admin_note  VARCHAR(255)  DEFAULT NULL,
            created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME      DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    try { $pdo->exec("ALTER TABLE deposits ADD COLUMN screenshot LONGTEXT DEFAULT NULL AFTER amount"); } catch (PDOException) {}

    // 6B. Own Auto-Payment SMS & Binance Verification Log Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS payment_sms_logs (
            id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            method      VARCHAR(30)   NOT NULL,
            sender      VARCHAR(60)   DEFAULT NULL,
            amount      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
            trx_id      VARCHAR(100)  NOT NULL UNIQUE,
            raw_text    TEXT          DEFAULT NULL,
            is_used     TINYINT(1)    NOT NULL DEFAULT 0,
            used_by_dep BIGINT UNSIGNED DEFAULT NULL,
            created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_trx_used (trx_id, is_used)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 7. Sales Log
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS sales_log (
            id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            product_id   INT UNSIGNED NOT NULL,
            product_name VARCHAR(150) NOT NULL,
            buyer_id     VARCHAR(50)  NOT NULL,
            qty          INT          NOT NULL DEFAULT 1,
            total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
            sold_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    try { $pdo->exec("ALTER TABLE sales_log ADD COLUMN total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER qty"); } catch (PDOException) {}

    // 8. Settings Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS settings (
            setting_key   VARCHAR(100) PRIMARY KEY,
            setting_value TEXT DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $defaultSettings = [
        'bkash_number'       => '017XXXXXXXX (Personal)',
        'nagad_number'       => '018XXXXXXXX (Personal)',
        'binance_id'         => 'Not Set',
        'bkash_status'       => '1',
        'nagad_status'       => '1',
        'binance_status'     => '1',
        'binance_rate'       => '120',
        'binance_api_key'    => '',
        'binance_api_secret' => '',
        'sms_sync_secret'    => 'mrms_sync_' . substr(md5(DB_NAME . MASTER_API_KEY), 0, 12),
        'min_deposit'        => '50',
        'support_link'       => 'https://t.me/yourusername',
        'site_notice'        => '⚡ Welcome to ' . SITE_NAME . '! Instant 24/7 Automated Digital Delivery.',
    ];
    $stmtSet = $pdo->prepare("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)");
    foreach ($defaultSettings as $k => $v) $stmtSet->execute([$k, $v]);

    // 9. High-Speed API & Order Indexes (Instant Lookup for Bots & Resellers)
    try { $pdo->exec("ALTER TABLE users ADD INDEX idx_api_key (api_key)"); } catch (PDOException) {}
    try { $pdo->exec("ALTER TABLE orders ADD INDEX idx_user_order (user_id, order_code)"); } catch (PDOException) {}
    try { $pdo->exec("ALTER TABLE products ADD INDEX idx_cat_status (category, status)"); } catch (PDOException) {}

    @file_put_contents($lockFile, (string)time());
}

function isPaymentMethodEnabled(mixed $val): bool {
    $s = strtolower(trim((string)($val ?? '1')));
    return !in_array($s, ['0', 'off', 'false', 'no'], true);
}

function jsonResponse(array $data, int $code = 200): never {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function makeSlug(string $name): string {
    $slug = strtolower(trim($name));
    $slug = preg_replace('/[^a-z0-9]+/', '_', $slug);
    $slug = trim((string)$slug, '_');
    return $slug !== '' ? $slug : 'item_' . rand(1000, 9999);
}

function generateApiKey(): string {
    return 'mrms_' . bin2hex(random_bytes(16));
}

function getSettings(PDO $pdo): array {
    $cached = cacheGet('site_settings_all', 30);
    if ($cached !== null) return $cached;
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
    $settings = [];
    foreach ($stmt->fetchAll() as $r) {
        $settings[$r['setting_key']] = $r['setting_value'];
    }
    cacheSet('site_settings_all', $settings);
    return $settings;
}

function getCurrentUser(PDO $pdo): ?array {
    if (empty($_SESSION['user_id'])) {
        if (session_status() === PHP_SESSION_ACTIVE) session_write_close();
        return null;
    }
    $uid = (int)$_SESSION['user_id'];
    $stmt = $pdo->prepare("SELECT id, name, email, balance, api_key, api_status, status, created_at FROM users WHERE id = ? LIMIT 1");
    $stmt->execute([$uid]);
    $user = $stmt->fetch();
    if (!$user || $user['status'] !== 'active') {
        unset($_SESSION['user_id']);
        if (session_status() === PHP_SESSION_ACTIVE) session_write_close();
        return null;
    }
    if (session_status() === PHP_SESSION_ACTIVE) session_write_close();
    return $user;
}

function verifyApiKey(PDO $pdo, string $apiKey): array {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE api_key = ? LIMIT 1");
    $stmt->execute([$apiKey]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(['success' => false, 'error' => 'Invalid API Key provided.'], 401);
    }
    if ($user['status'] !== 'active') {
        jsonResponse(['success' => false, 'error' => 'Account is banned or inactive.'], 403);
    }
    if ($user['api_status'] !== 'approved') {
        jsonResponse(['success' => false, 'error' => 'API Key is not approved by Admin.'], 403);
    }
    $user['auth_via'] = 'api';
    return $user;
}

function authenticateUserOrApi(PDO $pdo): array {
    $apiKey = trim((string)($_GET['api_key'] ?? $_POST['api_key'] ?? $_SERVER['HTTP_X_API_KEY'] ?? ''));
    if ($apiKey !== '') {
        return verifyApiKey($pdo, $apiKey);
    }

    $user = getCurrentUser($pdo);
    if (!$user) {
        jsonResponse([
            'success' => false,
            'error'   => 'Authentication required! Please provide a valid api_key parameter or sign in.'
        ], 401);
    }
    $user['auth_via'] = 'web';
    return $user;
}

function isAdminLoggedIn(): bool {
    return !empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireAdmin(): void {
    if (!isAdminLoggedIn()) {
        jsonResponse(['success' => false, 'error' => 'Unauthorized Admin Access'], 403);
    }
}

function getProductBySlug(PDO $pdo, string $slug): array {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE slug = ? AND status = 'active' LIMIT 1");
    $stmt->execute([$slug]);
    $product = $stmt->fetch();
    if (!$product) {
        jsonResponse(['success' => false, 'error' => "Product '$slug' not found or currently inactive."], 404);
    }
    return $product;
}

// ============================================================
//  HIGH-SPEED MICRO-CACHING ENGINE (PROTECTS DB FROM HEAVY TRAFFIC)
// ============================================================
function getCacheDir(): string {
    $dir = sys_get_temp_dir() . '/mrms_store_cache';
    if (!is_dir($dir)) @mkdir($dir, 0777, true);
    return $dir;
}

function cacheGet(string $key, int $ttlSeconds = 10): ?array {
    $file = getCacheDir() . '/c_' . md5($key) . '.json';
    if (!file_exists($file)) return null;
    if ((time() - (int)@filemtime($file)) > $ttlSeconds) return null;
    $raw = @file_get_contents($file);
    $dec = $raw ? json_decode($raw, true) : null;
    return is_array($dec) ? $dec : null;
}

function cacheSet(string $key, array $data): void {
    $file = getCacheDir() . '/c_' . md5($key) . '.json';
    @file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function clearStoreCache(): void {
    $files = @glob(getCacheDir() . '/c_*.json');
    if (is_array($files)) {
        foreach ($files as $f) @unlink($f);
    }
}

// ============================================================
//  OWN AUTO-PAYMENT ENGINE (bKash / Nagad SMS + Binance Read API)
// ============================================================
function parsePaymentSms(string $sender, string $body): ?array {
    $clean = trim((string)preg_replace('/\s+/', ' ', $body));
    $sUp   = strtoupper($sender);

    // Must be an incoming payment SMS (Received / Cash In) — ignore outgoing Send Money or Cash Out
    if (!preg_match('/(received|Cash\s*In)/i', $clean)) {
        return null;
    }

    $method = '';
    if (str_contains($sUp, 'BKASH') || stripos($clean, 'bKash') !== false || stripos($clean, 'TrxID') !== false) {
        $method = 'bKash';
    }
    if (str_contains($sUp, 'NAGAD') || stripos($clean, 'Nagad') !== false || stripos($clean, 'TxnID') !== false) {
        $method = 'Nagad';
    }
    if ($method === '') return null;

    // Extract TrxID / TxnID
    $trxId = '';
    if (preg_match('/(?:TrxID|TxnID|Trans\s*ID|Transaction\s*ID)[\s:\-]*([A-Z0-9]{6,20})/i', $clean, $m)) {
        $trxId = strtoupper(trim($m[1]));
    }
    if ($trxId === '') return null;

    // Extract Received Amount (Tk X,XXX.XX)
    $amount = 0.0;
    if (preg_match('/(?:received(?:\s+payment)?|Cash\s*In(?:\s+Received)?|Amount)[\s:]*?(?:Tk|BDT)\.?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i', $clean, $m)) {
        $amount = (float)str_replace(',', '', $m[1]);
    } elseif (preg_match('/(?:Tk|BDT)\.?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i', $clean, $m)) {
        $amount = (float)str_replace(',', '', $m[1]);
    }
    if ($amount <= 0) return null;

    // Extract Sender Mobile Number if present
    $fromNum = '';
    if (preg_match('/from\s+(01[3-9][0-9]{8})/i', $clean, $m)) {
        $fromNum = $m[1];
    } elseif (preg_match('/(?:Sender|Uddokta)[\s:]+(01[3-9][0-9]{8})/i', $clean, $m)) {
        $fromNum = $m[1];
    }

    return [
        'method'   => $method,
        'sender'   => $fromNum ?: $sender,
        'amount'   => round($amount, 2),
        'trx_id'   => $trxId,
        'raw_text' => substr($clean, 0, 500),
    ];
}

function syncBinancePayHistory(PDO $pdo, array $settings): void {
    $apiKey    = trim((string)($settings['binance_api_key'] ?? ''));
    $apiSecret = trim((string)($settings['binance_api_secret'] ?? ''));
    if ($apiKey === '' || $apiSecret === '') return;

    // Throttle Binance API calls to at most once every 10 seconds
    if (cacheGet('binance_pay_last_sync', 10) !== null) return;
    cacheSet('binance_pay_last_sync', ['ts' => time()]);

    $rate      = max(1.0, (float)($settings['binance_rate'] ?? 120));
    $timestamp = (int)round(microtime(true) * 1000);
    $query     = "limit=50&recvWindow=10000&timestamp={$timestamp}";
    $signature = hash_hmac('sha256', $query, $apiSecret);
    $url       = "https://api.binance.com/sapi/v1/pay/transactions?{$query}&signature={$signature}";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["X-MBX-APIKEY: {$apiKey}"],
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
    ]);
    $res  = curl_exec($ch);
    $data = $res ? json_decode($res, true) : null;
    curl_close($ch);

    if (!isset($data['data']) || !is_array($data['data'])) return;

    $ins = $pdo->prepare("INSERT IGNORE INTO payment_sms_logs (method, sender, amount, trx_id, raw_text) VALUES ('Binance', ?, ?, ?, ?)");
    foreach ($data['data'] as $tx) {
        $rawAmt = (float)($tx['amount'] ?? 0);
        if ($rawAmt <= 0) continue; // Only incoming funds (positive amount)

        $cur     = strtoupper((string)($tx['currency'] ?? 'USDT'));
        $bdtAmt  = in_array($cur, ['USDT', 'USDC', 'BUSD', 'FDUSD'], true) ? round($rawAmt * $rate, 2) : round($rawAmt, 2);
        $txId    = strtoupper(trim((string)($tx['transactionId'] ?? '')));
        $ordId   = strtoupper(trim((string)($tx['orderId'] ?? '')));
        $prepId  = strtoupper(trim((string)($tx['prepayId'] ?? '')));
        $payer   = (string)($tx['payerInfo']['name'] ?? $tx['payerInfo']['binanceId'] ?? 'BinanceUser');
        $summary = "Binance Pay: {$rawAmt} {$cur} (BDT {$bdtAmt})";

        if ($txId !== '') $ins->execute([$payer, $bdtAmt, $txId, $summary]);
        if ($ordId !== '' && $ordId !== $txId) $ins->execute([$payer, $bdtAmt, $ordId, $summary]);
        if ($prepId !== '' && $prepId !== $txId && $prepId !== $ordId) $ins->execute([$payer, $bdtAmt, $prepId, $summary]);
    }
}

function runBackgroundPaymentMatcher(PDO $pdo): int {
    $pendStmt = $pdo->query("SELECT id, user_id, method, trx_id, amount FROM deposits WHERE status = 'pending' ORDER BY id ASC LIMIT 50");
    $pending  = $pendStmt->fetchAll();
    if (empty($pending)) return 0;

    // If any pending deposit is Binance, sync latest Binance Pay history via Read-Only API
    foreach ($pending as $p) {
        if (strcasecmp($p['method'], 'Binance') === 0) {
            syncBinancePayHistory($pdo, getSettings($pdo));
            break;
        }
    }

    $matchedCount = 0;
    foreach ($pending as $dep) {
        $depId  = (int)$dep['id'];
        $userId = (int)$dep['user_id'];
        $method = trim((string)$dep['method']);
        $trxId  = strtoupper(trim((string)$dep['trx_id']));
        $reqAmt = (float)$dep['amount'];

        $logStmt = $pdo->prepare("SELECT * FROM payment_sms_logs WHERE trx_id = ? AND LOWER(method) = LOWER(?) AND is_used = 0 LIMIT 1");
        $logStmt->execute([$trxId, $method]);
        $log = $logStmt->fetch();
        if (!$log) continue;

        $logAmt = (float)$log['amount'];
        // Match if received amount is at least requested amount (within 1 Tk rounding tolerance)
        if (($logAmt + 1.00) < $reqAmt) continue;

        $pdo->beginTransaction();
        try {
            $lockDep = $pdo->prepare("SELECT status FROM deposits WHERE id = ? FOR UPDATE");
            $lockDep->execute([$depId]);
            if ($lockDep->fetchColumn() !== 'pending') {
                $pdo->rollBack();
                continue;
            }

            $lockLog = $pdo->prepare("SELECT is_used FROM payment_sms_logs WHERE id = ? FOR UPDATE");
            $lockLog->execute([$log['id']]);
            if ((int)$lockLog->fetchColumn() !== 0) {
                $pdo->rollBack();
                continue;
            }

            $creditAmt = $reqAmt;
            $pdo->prepare("UPDATE payment_sms_logs SET is_used = 1, used_by_dep = ? WHERE id = ?")->execute([$depId, $log['id']]);
            $pdo->prepare("UPDATE deposits SET status = 'approved', admin_note = 'Auto-Matched in Background', updated_at = NOW() WHERE id = ?")->execute([$depId]);
            $pdo->prepare("UPDATE users SET balance = balance + ? WHERE id = ?")->execute([$creditAmt, $userId]);
            $pdo->commit();
            $matchedCount++;
        } catch (Throwable) {
            if ($pdo->inTransaction()) $pdo->rollBack();
        }
    }

    if ($matchedCount > 0) clearStoreCache();
    return $matchedCount;
}