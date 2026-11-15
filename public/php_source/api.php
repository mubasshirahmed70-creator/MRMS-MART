<?php
// ============================================================
//  MRMS MART v6.0 PRO — api.php
//  Clean Slash (/) Bot Flow API + Rate Limiter (60 req/min)
//  Supports:
//    /api.php/API_KEY/balance
//    /api.php/API_KEY/categories
//    /api.php/API_KEY/products           (All products & stock)
//    /api.php/API_KEY/products/CATEGORY  (Products under a category)
//    /api.php/API_KEY/stock/PRODUCT_SLUG (Single product stock)
//    /api.php/API_KEY/buy/PRODUCT_SLUG/QTY
//    /api.php/API_KEY/code/EMAIL|PASS|TOKEN|CLIENT_ID
//    /api.php/API_KEY/orders
// ============================================================

declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-KEY, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rawInput = file_get_contents('php://input');
$jsonBody = [];
if (!empty($rawInput)) {
    $decoded = json_decode($rawInput, true);
    if (is_array($decoded)) $jsonBody = $decoded;
}

function input(string $key, mixed $default = ''): mixed {
    global $jsonBody;
    if (isset($_POST[$key])) return is_string($_POST[$key]) ? trim($_POST[$key]) : $_POST[$key];
    if (isset($_GET[$key]))  return is_string($_GET[$key])  ? trim($_GET[$key])  : $_GET[$key];
    if (isset($jsonBody[$key])) return is_string($jsonBody[$key]) ? trim($jsonBody[$key]) : $jsonBody[$key];
    return $default;
}

// ── SMART RATE LIMITER (60 Requests / Minute + Auto Temp File Cleaner) ──
function checkRateLimit(string $identifier, int $maxRequests = 60, int $windowSeconds = 60): void {
    $dir = sys_get_temp_dir() . '/mrms_ratelimit';
    if (!is_dir($dir)) @mkdir($dir, 0777, true);

    // 2% chance per request to auto-clean expired rate-limit files older than 2 minutes
    if (rand(1, 50) === 1) {
        $oldFiles = @glob($dir . '/rl_*.json');
        if (is_array($oldFiles)) {
            $cut = time() - 120;
            foreach ($oldFiles as $of) {
                if ((int)@filemtime($of) < $cut) @unlink($of);
            }
        }
    }

    $file = $dir . '/rl_' . md5($identifier) . '.json';
    $now  = time();
    $data = ['start' => $now, 'count' => 0];

    if (file_exists($file)) {
        $raw = @file_get_contents($file);
        $dec = $raw ? json_decode($raw, true) : null;
        if (is_array($dec) && isset($dec['start'], $dec['count'])) {
            if (($now - (int)$dec['start']) < $windowSeconds) {
                $data = $dec;
            }
        }
    }

    $data['count']++;
    @file_put_contents($file, json_encode($data));

    $remaining = max(0, $maxRequests - $data['count']);
    header("X-RateLimit-Limit: {$maxRequests}");
    header("X-RateLimit-Remaining: {$remaining}");

    if ($data['count'] > $maxRequests) {
        $retry = max(1, $windowSeconds - ($now - (int)$data['start']));
        header("Retry-After: {$retry}");
        jsonResponse([
            'success'     => false,
            'error'       => "Rate limit exceeded! Maximum {$maxRequests} requests allowed per minute.",
            'retry_after' => $retry . 's'
        ], 429);
    }
}

$pdo = getDB();

// ============================================================
//  CLEAN SLASH (/) URL ROUTER PARSER
// ============================================================
$pathInfo = trim((string)($_SERVER['PATH_INFO'] ?? ''), '/');
if ($pathInfo === '' && isset($_GET['r'])) {
    $pathInfo = trim((string)$_GET['r'], '/');
}
// Also check if query string itself is passed in slash format: api.php?KEY/buy/hotmail/5
if ($pathInfo === '' && !empty($_SERVER['QUERY_STRING']) && !str_contains($_SERVER['QUERY_STRING'], '=')) {
    $pathInfo = trim(urldecode($_SERVER['QUERY_STRING']), '/');
}

if ($pathInfo !== '') {
    $segments = explode('/', $pathInfo);
    // Segment 0 = API_KEY
    if (!empty($segments[0])) {
        $_GET['api_key'] = urldecode($segments[0]);
    }
    $cmd = strtolower(urldecode($segments[1] ?? 'balance'));

    if ($cmd === 'balance' || $cmd === 'me') {
        $_GET['action'] = 'balance';
    } elseif ($cmd === 'categories' || $cmd === 'category') {
        $_GET['action'] = 'categories';
    } elseif ($cmd === 'products' || $cmd === 'items') {
        $_GET['action'] = 'products';
        if (!empty($segments[2])) {
            $_GET['category'] = urldecode($segments[2]);
        }
    } elseif ($cmd === 'stock') {
        $_GET['action'] = 'stock';
        if (!empty($segments[2])) {
            $_GET['slug'] = urldecode($segments[2]);
        }
    } elseif ($cmd === 'buy' || $cmd === 'purchase') {
        $_GET['action'] = 'buy';
        if (!empty($segments[2])) $_GET['slug'] = urldecode($segments[2]);
        if (!empty($segments[3])) $_GET['qty']  = (int)$segments[3];
    } elseif ($cmd === 'code' || $cmd === 'otp' || $cmd === 'mail') {
        $_GET['action'] = 'get_otp';
        if (!empty($segments[2])) {
            // Re-join remaining segments in case token had slashes
            $_GET['account'] = urldecode(implode('/', array_slice($segments, 2)));
        }
    } elseif ($cmd === 'orders' || $cmd === 'order') {
        $_GET['action'] = 'orders';
        if (!empty($segments[2])) $_GET['order_code'] = urldecode($segments[2]);
    } else {
        $_GET['action'] = $cmd;
    }
}

$action = strtolower((string)input('action', ''));
$apiKey = (string)input('key', (string)input('api_key', (string)($_SERVER['HTTP_X_API_KEY'] ?? '')));
$isInternalWeb = ((string)input('web_client', '') === '1');

// Apply Rate Limit
if ($apiKey !== '') {
    checkRateLimit('key_' . $apiKey, 60, 60);
} else {
    checkRateLimit('ip_' . ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'), 120, 60);
}

if ($action === '' && $apiKey !== '') {
    $action = 'balance';
}

if ($action === '') {
    jsonResponse([
        'success' => false,
        'service' => SITE_NAME . ' Bot & Reseller API v6.0',
        'error'   => 'API Key required. Format: ' . SITE_URL . '/api.php/YOUR_API_KEY/balance',
    ], 400);
}

// ============================================================
//  1. WEB STOREFRONT CATALOG (With 5s High-Speed Micro-Cache)
// ============================================================
if ($action === 'web_catalog') {
    $cachedCatalog = function_exists('cacheGet') ? cacheGet('web_catalog_data', 5) : null;

    if ($cachedCatalog !== null) {
        $categories = $cachedCatalog['categories'];
        $products   = $cachedCatalog['products'];
        $totalStock = $cachedCatalog['total_stock'];
    } else {
        $catStmt = $pdo->query("SELECT id, name, slug, icon FROM categories WHERE status = 'active' ORDER BY sort_order ASC, id ASC");
        $categories = $catStmt->fetchAll();

        $prodStmt = $pdo->query("
            SELECT p.id, p.name, p.slug, p.category, p.price, p.description, p.full_description, COUNT(s.id) AS stock
            FROM products p
            LEFT JOIN stock s ON s.product_id = p.id AND s.status = 'available'
            WHERE p.status = 'active'
            GROUP BY p.id
            ORDER BY p.category ASC, p.id ASC
        ");
        $products = [];
        $totalStock = 0;
        foreach ($prodStmt->fetchAll() as $r) {
            $stk = (int)$r['stock'];
            $totalStock += $stk;
            $products[] = [
                'id'               => (int)$r['id'],
                'name'             => $r['name'],
                'slug'             => $r['slug'],
                'category'         => $r['category'],
                'price'            => (float)$r['price'],
                'description'      => $r['description'] ?? '',
                'full_description' => $r['full_description'] ?? '',
                'stock'            => $stk,
            ];
        }
        if (function_exists('cacheSet')) {
            cacheSet('web_catalog_data', [
                'categories'  => $categories,
                'products'    => $products,
                'total_stock' => $totalStock
            ]);
        }
    }

    if (function_exists('runBackgroundPaymentMatcher')) runBackgroundPaymentMatcher($pdo);
    $user = getCurrentUser($pdo);
    $st   = getSettings($pdo);
    jsonResponse([
        'success'        => true,
        'currency'       => CURRENCY,
        'categories'     => $categories,
        'products'       => $products,
        'total_stock'    => $totalStock,
        'payment_config' => [
            'bkash_status'   => isPaymentMethodEnabled($st['bkash_status'] ?? '1'),
            'nagad_status'   => isPaymentMethodEnabled($st['nagad_status'] ?? '1'),
            'binance_status' => isPaymentMethodEnabled($st['binance_status'] ?? '1'),
            'bkash_number'   => $st['bkash_number'] ?? '',
            'nagad_number'   => $st['nagad_number'] ?? '',
            'binance_id'     => $st['binance_id'] ?? '',
            'binance_rate'   => (float)($st['binance_rate'] ?? 120),
            'min_deposit'    => (float)($st['min_deposit'] ?? 50),
        ],
        'user'           => $user ? [
            'id'         => (int)$user['id'],
            'name'       => $user['name'],
            'email'      => $user['email'],
            'balance'    => (float)$user['balance'],
            'api_status' => $user['api_status'],
            'api_key'    => $user['api_status'] === 'approved' ? $user['api_key'] : null,
        ] : null
    ]);
}

// ============================================================
//  2. USER AUTHENTICATION (Register / Login / Logout)
// ============================================================
if ($action === 'register') {
    $name     = trim((string)input('name'));
    $email    = strtolower(trim((string)input('email')));
    $password = (string)input('password');

    if (strlen($name) < 2) jsonResponse(['success' => false, 'error' => 'Name must be at least 2 characters.'], 400);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonResponse(['success' => false, 'error' => 'Valid email address required.'], 400);
    if (strlen($password) < 4) jsonResponse(['success' => false, 'error' => 'Password must be at least 4 characters.'], 400);

    try {
        $chk = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $chk->execute([$email]);
        if ($chk->fetch()) jsonResponse(['success' => false, 'error' => 'Email already registered! Please Sign In.'], 409);

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $pdo->prepare("INSERT INTO users (name, email, password, balance, api_status, status) VALUES (?, ?, ?, 0.00, 'none', 'active')")
            ->execute([$name, $email, $hash]);

        $userId = (int)$pdo->lastInsertId();
        $_SESSION['user_id'] = $userId;

        jsonResponse([
            'success' => true,
            'message' => 'Account created successfully!',
            'user'    => ['id' => $userId, 'name' => $name, 'email' => $email, 'balance' => 0.00, 'api_status' => 'none', 'api_key' => null]
        ]);
    } catch (Throwable) {
        jsonResponse(['success' => false, 'error' => 'Registration failed.'], 500);
    }
}

if ($action === 'login') {
    $email    = strtolower(trim((string)input('email')));
    $password = (string)input('password');

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        jsonResponse(['success' => false, 'error' => 'Incorrect email or password!'], 401);
    }
    if ($user['status'] !== 'active') {
        jsonResponse(['success' => false, 'error' => 'Your account is suspended.'], 403);
    }

    $_SESSION['user_id'] = (int)$user['id'];
    jsonResponse([
        'success' => true,
        'message' => 'Signed in successfully!',
        'user'    => [
            'id'         => (int)$user['id'],
            'name'       => $user['name'],
            'email'      => $user['email'],
            'balance'    => (float)$user['balance'],
            'api_status' => $user['api_status'],
            'api_key'    => $user['api_status'] === 'approved' ? $user['api_key'] : null,
        ]
    ]);
}

if ($action === 'logout') {
    unset($_SESSION['user_id']);
    jsonResponse(['success' => true, 'message' => 'Logged out.']);
}

// ── OFFICIAL GOOGLE 1-CLICK LOGIN / REGISTER VERIFIER ──
if ($action === 'google_login') {
    $credential = trim((string)input('credential'));
    if ($credential === '') {
        jsonResponse(['success' => false, 'error' => 'Missing Google credential token.'], 400);
    }

    $verifyUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($credential);
    $ch = curl_init($verifyUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $res   = curl_exec($ch);
    $gData = $res ? json_decode($res, true) : null;
    curl_close($ch);

    if (empty($gData['email']) || ($gData['email_verified'] ?? '') !== 'true') {
        jsonResponse(['success' => false, 'error' => 'Google authentication failed or email not verified.'], 401);
    }

    $settings = getSettings($pdo);
    $expectedClientId = trim($settings['google_client_id'] ?? '') ?: '606638148564-at6p4i35b1gk7ntvlrd25cc05mrq9b3d.apps.googleusercontent.com';
    if (($gData['aud'] ?? '') !== $expectedClientId) {
        jsonResponse(['success' => false, 'error' => 'Google Client ID mismatch!'], 401);
    }

    $email = strtolower(trim($gData['email']));
    $name  = trim($gData['name'] ?? explode('@', $email)[0]);

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        if ($user['status'] !== 'active') {
            jsonResponse(['success' => false, 'error' => 'Your account has been suspended.'], 403);
        }
        $_SESSION['user_id'] = (int)$user['id'];
        jsonResponse([
            'success' => true,
            'message' => 'Signed in with Google!',
            'user'    => [
                'id'         => (int)$user['id'],
                'name'       => $user['name'],
                'email'      => $user['email'],
                'balance'    => (float)$user['balance'],
                'api_status' => $user['api_status'],
                'api_key'    => $user['api_status'] === 'approved' ? $user['api_key'] : null,
            ]
        ]);
    }

    $randomPass = password_hash(bin2hex(random_bytes(12)), PASSWORD_DEFAULT);
    $pdo->prepare("INSERT INTO users (name, email, password, balance, api_status, status) VALUES (?, ?, ?, 0.00, 'none', 'active')")
        ->execute([$name, $email, $randomPass]);

    $newUserId = (int)$pdo->lastInsertId();
    $_SESSION['user_id'] = $newUserId;

    jsonResponse([
        'success' => true,
        'message' => 'Account created with Google!',
        'user'    => [
            'id'         => $newUserId,
            'name'       => $name,
            'email'      => $email,
            'balance'    => 0.00,
            'api_status' => 'none',
            'api_key'    => null,
        ]
    ]);
}

// ============================================================
//  3. BOT & RESELLER API ENDPOINTS (STEP-BY-STEP BOT FLOW)
// ============================================================

function authBotOrWeb(PDO $pdo, string $apiKey): array {
    if ($apiKey !== '') return verifyApiKey($pdo, $apiKey);
    return authenticateUserOrApi($pdo);
}

// ── API 1: Check Balance (/api.php/API_KEY/balance) ──
if ($action === 'balance' || $action === 'me') {
    $user = authBotOrWeb($pdo, $apiKey);
    jsonResponse([
        'success'    => true,
        'id'         => (int)$user['id'],
        'name'       => $user['name'],
        'email'      => $user['email'],
        'balance'    => (float)$user['balance'],
        'currency'   => CURRENCY,
        'api_status' => $user['api_status'],
        'api_key'    => $user['api_status'] === 'approved' ? $user['api_key'] : null
    ]);
}

// ── API 2: Get Categories for Bot Buttons (With 5s Micro-Cache) ──
if ($action === 'categories') {
    if ($apiKey === '') jsonResponse(['success' => false, 'error' => 'API Key required.'], 401);
    verifyApiKey($pdo, $apiKey);

    $cats = function_exists('cacheGet') ? cacheGet('bot_categories_list', 5) : null;
    if ($cats === null) {
        $stmt = $pdo->query("
            SELECT c.id, c.name, c.slug, COUNT(p.id) AS total_products
            FROM categories c
            LEFT JOIN products p ON p.category = c.slug AND p.status = 'active'
            WHERE c.status = 'active'
            GROUP BY c.id
            ORDER BY c.sort_order ASC, c.id ASC
        ");
        $cats = [];
        foreach ($stmt->fetchAll() as $r) {
            $cats[] = [
                'id'             => (int)$r['id'],
                'name'           => $r['name'],
                'category_code'  => $r['slug'],
                'total_products' => (int)$r['total_products']
            ];
        }
        if (function_exists('cacheSet')) cacheSet('bot_categories_list', $cats);
    }
    jsonResponse(['success' => true, 'categories' => $cats]);
}

// ── API 3: Get Products & Stock (/api.php/API_KEY/products OR /products/CATEGORY_CODE OR /stock/PRODUCT_CODE) ──
if ($action === 'products' || $action === 'stock') {
    if ($apiKey === '') jsonResponse(['success' => false, 'error' => 'API Key required.'], 401);
    verifyApiKey($pdo, $apiKey);

    $slug     = strtolower((string)input('slug', (string)input('product', '')));
    $category = strtolower((string)input('category', ''));

    // Single product stock check (By Slug OR Product ID — With 5s Micro-Cache)
    if ($slug !== '') {
        $sCacheKey = 'bot_stk_' . $slug;
        $cachedSingle = function_exists('cacheGet') ? cacheGet($sCacheKey, 5) : null;
        if ($cachedSingle !== null) {
            jsonResponse($cachedSingle);
        }

        if (is_numeric($slug)) {
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND status = 'active' LIMIT 1");
            $stmt->execute([(int)$slug]);
            $product = $stmt->fetch();
            if (!$product) jsonResponse(['success' => false, 'error' => "Product ID #$slug not found."], 404);
        } else {
            $product = getProductBySlug($pdo, $slug);
        }

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM stock WHERE product_id = ? AND status = 'available'");
        $stmt->execute([$product['id']]);
        $stock = (int)$stmt->fetchColumn();

        $singleRes = [
            'success'      => true,
            'product_id'   => (int)$product['id'],
            'name'         => $product['name'],
            'product_code' => $product['slug'],
            'category'     => $product['category'],
            'price'        => (float)$product['price'],
            'currency'     => CURRENCY,
            'stock'        => $stock,
            'description'  => $product['description'] ?? '',
            'full_details' => $product['full_description'] ?? ''
        ];
        if (function_exists('cacheSet')) cacheSet($sCacheKey, $singleRes);
        jsonResponse($singleRes);
    }

    // All products or filtered by category (With Micro-Cache + Full Details for Bot!)
    $cacheKey = 'bot_prods_' . ($category !== '' ? $category : 'all');
    $list = function_exists('cacheGet') ? cacheGet($cacheKey, 10) : null;

    if ($list === null) {
        $sql = "
            SELECT p.id, p.name, p.slug, p.category, p.price, p.description, p.full_description, COUNT(s.id) AS stock
            FROM products p
            LEFT JOIN stock s ON s.product_id = p.id AND s.status = 'available'
            WHERE p.status = 'active'
        ";
        $params = [];
        if ($category !== '' && $category !== 'all') {
            $sql .= " AND p.category = ? ";
            $params[] = $category;
        }
        $sql .= " GROUP BY p.id ORDER BY p.category ASC, p.id ASC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $list = [];
        foreach ($stmt->fetchAll() as $r) {
            $list[] = [
                'product_id'   => (int)$r['id'],
                'name'         => $r['name'],
                'product_code' => $r['slug'],
                'category'     => $r['category'],
                'price'        => (float)$r['price'],
                'stock'        => (int)$r['stock'],
                'description'  => $r['description'] ?? '',
                'full_details' => $r['full_description'] ?? ''
            ];
        }
        if (function_exists('cacheSet')) cacheSet($cacheKey, $list);
    }

    jsonResponse([
        'success'  => true,
        'category' => $category !== '' ? $category : 'all',
        'currency' => CURRENCY,
        'products' => $list
    ]);
}

// ── API 4: Instant Buy Product (/api.php/API_KEY/buy/PRODUCT_CODE/QTY) ──
if ($action === 'buy') {
    $user = authBotOrWeb($pdo, $apiKey);
    $slug = strtolower((string)input('slug', (string)input('product', '')));
    $qty  = (int)input('qty', 1);

    if ($slug === '') jsonResponse(['success' => false, 'error' => 'Product code or ID is required.'], 400);
    if ($qty < 1 || $qty > 5000) jsonResponse(['success' => false, 'error' => 'Quantity must be between 1 and 5000.'], 400);

    // Support buying by Product ID (1, 2, 3) OR Product Code (hotmail)
    if (is_numeric($slug)) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND status = 'active' LIMIT 1");
        $stmt->execute([(int)$slug]);
        $product = $stmt->fetch();
        if (!$product) jsonResponse(['success' => false, 'error' => "Product ID #$slug not found."], 404);
    } else {
        $product = getProductBySlug($pdo, $slug);
    }

    $unitPrice  = (float)$product['price'];
    $totalPrice = round($unitPrice * $qty, 2);

    $pdo->beginTransaction();
    try {
        $uStmt = $pdo->prepare("SELECT balance FROM users WHERE id = ? FOR UPDATE");
        $uStmt->execute([$user['id']]);
        $currentBalance = (float)$uStmt->fetchColumn();

        if ($currentBalance < $totalPrice) {
            $pdo->rollBack();
            jsonResponse([
                'success'         => false,
                'error'           => 'Insufficient balance! Needed: ' . CURRENCY . number_format($totalPrice, 2) . ', Balance: ' . CURRENCY . number_format($currentBalance, 2),
                'required_amount' => $totalPrice,
                'current_balance' => $currentBalance
            ], 400);
        }

        $sStmt = $pdo->prepare("
            SELECT id, data FROM stock
            WHERE product_id = ? AND status = 'available'
            ORDER BY id ASC
            LIMIT ?
            FOR UPDATE
        ");
        $sStmt->execute([$product['id'], $qty]);
        $rows = $sStmt->fetchAll();

        if (count($rows) < $qty) {
            $pdo->rollBack();
            jsonResponse([
                'success'   => false,
                'error'     => 'Not enough stock! Available: ' . count($rows) . ', Requested: ' . $qty,
                'available' => count($rows),
                'requested' => $qty
            ], 400);
        }

        $stockIds   = array_column($rows, 'id');
        $items      = array_column($rows, 'data');
        $newBalance = round($currentBalance - $totalPrice, 2);

        $pdo->prepare("UPDATE users SET balance = ? WHERE id = ?")->execute([$newBalance, $user['id']]);

        $orderCode = 'ORD-' . strtoupper(bin2hex(random_bytes(4)));
        $source    = ($user['auth_via'] ?? 'web') === 'api' ? 'api' : 'web';
        $itemsJson = json_encode($items, JSON_UNESCAPED_UNICODE);

        $pdo->prepare("
            INSERT INTO orders (order_code, user_id, product_id, product_name, qty, unit_price, total_price, items_data, buy_source)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ")->execute([$orderCode, $user['id'], $product['id'], $product['name'], $qty, $unitPrice, $totalPrice, $itemsJson, $source]);

        $orderId = (int)$pdo->lastInsertId();
        $placeholders = implode(',', array_fill(0, count($stockIds), '?'));
        // Since purchased items are permanently saved in 'orders' table, delete sold rows from 'stock' to keep stock table ultra-fast forever!
        $pdo->prepare("DELETE FROM stock WHERE id IN ($placeholders)")->execute($stockIds);

        $pdo->prepare("INSERT INTO sales_log (product_id, product_name, buyer_id, qty, total_amount) VALUES (?, ?, ?, ?, ?)")
            ->execute([$product['id'], $product['name'], $user['email'], $qty, $totalPrice]);

        $pdo->commit();
        if (function_exists('clearStoreCache')) clearStoreCache();

        jsonResponse([
            'success'      => true,
            'order_code'   => $orderCode,
            'product_id'   => (int)$product['id'],
            'product'      => $product['name'],
            'product_code' => $product['slug'],
            'qty'          => count($items),
            'unit_price'   => $unitPrice,
            'total_price'  => $totalPrice,
            'new_balance'  => $newBalance,
            'currency'     => CURRENCY,
            'items'        => $items,
            'purchased_at' => date('Y-m-d H:i:s')
        ]);
    } catch (Throwable) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        jsonResponse(['success' => false, 'error' => 'Transaction failed.'], 500);
    }
}

// ── API 5: Get Mail OTP Code (/api.php/API_KEY/code/EMAIL|PASS|TOKEN|CLIENT_ID) ──
if ($action === 'get_otp' || $action === 'read_mail' || $action === 'code') {
    if (!$isInternalWeb) {
        if ($apiKey === '') jsonResponse(['success' => false, 'error' => 'API Key required.'], 401);
        verifyApiKey($pdo, $apiKey);
    }

    $rawAccount = trim((string)input('account', (string)input('mail', (string)input('mail_data', ''))));
    if ($rawAccount === '') {
        jsonResponse(['success' => false, 'error' => 'Mail line required (email|password|refresh_token|client_id)'], 400);
    }

    $firstLine = trim(explode("\n", $rawAccount)[0]);
    $parts = preg_split('/[\|\:\;\t]+/', $firstLine);
    $parts = array_values(array_filter(array_map('trim', $parts), fn($v) => $v !== ''));

    if (count($parts) < 2) {
        jsonResponse(['success' => false, 'error' => 'Invalid format! Expected: email|password|refresh_token|client_id'], 400);
    }

    $email = $parts[0];
    $pass  = $parts[1];
    $refreshToken = '';
    $clientId     = '';

    if (count($parts) >= 4) {
        if (strlen($parts[2]) > strlen($parts[3])) {
            $refreshToken = $parts[2];
            $clientId     = $parts[3];
        } else {
            $clientId     = $parts[2];
            $refreshToken = $parts[3];
        }
    } elseif (count($parts) === 3 && strlen($parts[2]) > 40) {
        $refreshToken = $parts[2];
        $clientId     = '9e5f94bc-e8a4-4e73-b8be-63364c29d753';
    }

    if ($refreshToken !== '' && $clientId !== '') {
        $result = fetchHotmailViaOAuth2($email, $refreshToken, $clientId);
        jsonResponse($result, $result['success'] ? 200 : 400);
    }

    if (function_exists('imap_open')) {
        $result = fetchMailViaImap($email, $pass);
        jsonResponse($result, $result['success'] ? 200 : 400);
    }

    jsonResponse(['success' => false, 'error' => 'Full OAuth2 token required: email|password|refresh_token|client_id'], 400);
}

// ============================================================
//  4. PROFILE, ORDERS & DEPOSITS
// ============================================================
if ($action === 'update_profile') {
    $user = getCurrentUser($pdo);
    if (!$user) jsonResponse(['success' => false, 'error' => 'Unauthorized'], 401);

    $name  = trim((string)input('name'));
    $email = strtolower(trim((string)input('email')));
    if (strlen($name) < 2) jsonResponse(['success' => false, 'error' => 'Name too short.'], 400);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonResponse(['success' => false, 'error' => 'Invalid email.'], 400);

    $chk = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1");
    $chk->execute([$email, $user['id']]);
    if ($chk->fetch()) jsonResponse(['success' => false, 'error' => 'Email already in use.'], 409);

    $pdo->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?")->execute([$name, $email, $user['id']]);
    jsonResponse(['success' => true, 'message' => 'Profile updated!', 'name' => $name, 'email' => $email]);
}

if ($action === 'change_password') {
    $user = getCurrentUser($pdo);
    if (!$user) jsonResponse(['success' => false, 'error' => 'Unauthorized'], 401);

    $cur = (string)input('current_password');
    $new = (string)input('new_password');
    if (strlen($new) < 4) jsonResponse(['success' => false, 'error' => 'New password min 4 chars.'], 400);

    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$user['id']]);
    if (!password_verify($cur, (string)$stmt->fetchColumn())) {
        jsonResponse(['success' => false, 'error' => 'Current password incorrect.'], 400);
    }

    $pdo->prepare("UPDATE users SET password = ? WHERE id = ?")->execute([password_hash($new, PASSWORD_DEFAULT), $user['id']]);
    jsonResponse(['success' => true, 'message' => 'Password updated!']);
}

if ($action === 'request_api') {
    $user = getCurrentUser($pdo);
    if (!$user) jsonResponse(['success' => false, 'error' => 'Sign in first.'], 401);
    if ($user['api_status'] === 'approved') jsonResponse(['success' => false, 'error' => 'Already approved!'], 400);

    $pdo->prepare("UPDATE users SET api_status = 'pending' WHERE id = ?")->execute([$user['id']]);
    jsonResponse(['success' => true, 'api_status' => 'pending', 'message' => 'API Access requested!']);
}

if ($action === 'regenerate_api') {
    $user = getCurrentUser($pdo);
    if (!$user) jsonResponse(['success' => false, 'error' => 'Sign in first.'], 401);
    if ($user['api_status'] !== 'approved') jsonResponse(['success' => false, 'error' => 'API not approved yet.'], 403);

    $newKey = generateApiKey();
    $pdo->prepare("UPDATE users SET api_key = ? WHERE id = ?")->execute([$newKey, $user['id']]);
    jsonResponse(['success' => true, 'api_key' => $newKey, 'message' => 'New API Key generated!']);
}

if ($action === 'orders') {
    $user = authBotOrWeb($pdo, $apiKey);
    $orderCode = (string)input('order_code', '');

    if ($orderCode !== '') {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? AND order_code = ? LIMIT 1");
        $stmt->execute([$user['id'], $orderCode]);
        $ord = $stmt->fetch();
        if (!$ord) jsonResponse(['success' => false, 'error' => 'Order not found.'], 404);
        jsonResponse([
            'success'     => true,
            'order_code'  => $ord['order_code'],
            'product'     => $ord['product_name'],
            'qty'         => (int)$ord['qty'],
            'unit_price'  => (float)$ord['unit_price'],
            'total_price' => (float)$ord['total_price'],
            'items'       => json_decode($ord['items_data'], true) ?: [],
            'created_at'  => $ord['created_at']
        ]);
    }

    $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 100");
    $stmt->execute([$user['id']]);
    $orders = [];
    foreach ($stmt->fetchAll() as $r) {
        $orders[] = [
            'id'          => (int)$r['id'],
            'order_code'  => $r['order_code'],
            'product'     => $r['product_name'],
            'qty'         => (int)$r['qty'],
            'unit_price'  => (float)$r['unit_price'],
            'total_price' => (float)$r['total_price'],
            'buy_source'  => $r['buy_source'],
            'items'       => json_decode($r['items_data'], true) ?: [],
            'created_at'  => $r['created_at']
        ];
    }
    jsonResponse(['success' => true, 'orders' => $orders]);
}

if ($action === 'download_order') {
    $user      = authBotOrWeb($pdo, $apiKey);
    $orderCode = (string)input('order_code');
    $format    = strtolower((string)input('format', 'txt'));

    $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? AND order_code = ? LIMIT 1");
    $stmt->execute([$user['id'], $orderCode]);
    $ord = $stmt->fetch();
    if (!$ord) die('Order not found.');

    $items = json_decode($ord['items_data'], true) ?: [];
    $filename = makeSlug($ord['product_name']) . '_' . $ord['order_code'];

    if ($format === 'csv') {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '.csv"');
        $lines = ['#,Account'];
        foreach ($items as $i => $item) {
            $lines[] = ($i + 1) . ',"' . str_replace('"', '""', trim((string)$item)) . '"';
        }
        echo implode("\n", $lines);
        exit;
    }

    header('Content-Type: text/plain; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '.txt"');
    echo implode("\n", $items);
    exit;
}

if ($action === 'deposit') {
    $user = getCurrentUser($pdo);
    if (!$user) jsonResponse(['success' => false, 'error' => 'Sign in first.'], 401);

    $method     = trim((string)input('method', 'bKash'));
    $senderNum  = trim((string)input('sender_num', ''));
    $trxId      = strtoupper(trim((string)input('trx_id', '')));
    $amount     = round((float)input('amount', 0), 2);
    $screenshot = trim((string)input('screenshot_data', ''));

    // Also support raw file upload if sent via $_FILES['screenshot']
    if ($screenshot === '' && !empty($_FILES['screenshot']['tmp_name'])) {
        $rawImg = @file_get_contents($_FILES['screenshot']['tmp_name']);
        if ($rawImg !== false && strlen($rawImg) > 50 && strlen($rawImg) < 4000000) {
            $mime = $_FILES['screenshot']['type'] ?: 'image/jpeg';
            $screenshot = 'data:' . $mime . ';base64,' . base64_encode($rawImg);
        }
    }

    $settings = getSettings($pdo);
    $minDep   = (float)($settings['min_deposit'] ?? 50);

    // Check if Admin turned OFF the selected payment method
    $mKey = strtolower($method) . '_status';
    if (in_array(strtolower($method), ['bkash', 'nagad', 'binance'], true) && !isPaymentMethodEnabled($settings[$mKey] ?? '1')) {
        jsonResponse(['success' => false, 'error' => "{$method} payment is currently turned OFF by Admin. Please choose another method."], 400);
    }

    if ($amount < $minDep) jsonResponse(['success' => false, 'error' => 'Minimum deposit is ' . CURRENCY . $minDep], 400);
    if (strlen($trxId) < 4) jsonResponse(['success' => false, 'error' => 'Enter a valid Transaction ID (TrxID / Order ID).'], 400);
    if ($screenshot === '') jsonResponse(['success' => false, 'error' => 'Please upload your payment screenshot!'], 400);

    $chk = $pdo->prepare("SELECT id FROM deposits WHERE trx_id = ? LIMIT 1");
    $chk->execute([$trxId]);
    if ($chk->fetch()) jsonResponse(['success' => false, 'error' => 'This TrxID is already submitted!'], 409);

    $pdo->prepare("INSERT INTO deposits (user_id, method, sender_num, trx_id, amount, screenshot, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')")
        ->execute([$user['id'], $method, $senderNum, $trxId, $amount, $screenshot]);

    // Trigger background auto-matcher immediately in case SMS/Binance log is already present
    $matched = function_exists('runBackgroundPaymentMatcher') ? runBackgroundPaymentMatcher($pdo) : 0;

    if ($matched > 0) {
        jsonResponse(['success' => true, 'auto_approved' => true, 'message' => 'Payment verified & balance added automatically!']);
    }

    jsonResponse(['success' => true, 'auto_approved' => false, 'message' => 'Payment submitted! Status: Pending (Wait few minutes for approval).']);
}

if ($action === 'deposits') {
    $user = getCurrentUser($pdo);
    if (!$user) jsonResponse(['success' => false, 'error' => 'Unauthorized'], 401);
    if (function_exists('runBackgroundPaymentMatcher')) runBackgroundPaymentMatcher($pdo);
    $stmt = $pdo->prepare("SELECT id, user_id, method, sender_num, trx_id, amount, (screenshot IS NOT NULL AND screenshot != '') AS has_screenshot, status, admin_note, created_at, updated_at FROM deposits WHERE user_id = ? ORDER BY id DESC LIMIT 50");
    $stmt->execute([$user['id']]);
    jsonResponse(['success' => true, 'deposits' => $stmt->fetchAll()]);
}

// ── OWN ANDROID BACKGROUND SMS SYNC ENDPOINT (bKash & Nagad Queue + Instant Auto-Matcher) ──
if ($action === 'own_sms_sync' || $action === 'sms_webhook') {
    $settings = getSettings($pdo);
    $expectedSecret = trim((string)($settings['sms_sync_secret'] ?? ''));
    $givenSecret    = trim((string)input('secret', (string)input('key', (string)($_SERVER['HTTP_X_SYNC_SECRET'] ?? ''))));

    if ($givenSecret === '' || ($givenSecret !== $expectedSecret && $givenSecret !== MASTER_API_KEY)) {
        jsonResponse(['success' => false, 'error' => 'Invalid Sync Secret Key!'], 403);
    }

    $batch = input('messages', []);
    if (!is_array($batch) || empty($batch)) {
        $singleSender = (string)input('sender', (string)input('from', ''));
        $singleBody   = (string)input('body', (string)input('message', (string)input('text', '')));
        if ($singleBody !== '') {
            $batch = [['sender' => $singleSender, 'body' => $singleBody]];
        }
    }

    $savedSms = 0;
    $ins = $pdo->prepare("INSERT IGNORE INTO payment_sms_logs (method, sender, amount, trx_id, raw_text) VALUES (?, ?, ?, ?, ?)");
    foreach ($batch as $item) {
        if (!is_array($item)) continue;
        $s = (string)($item['sender'] ?? $item['from'] ?? '');
        $b = (string)($item['body'] ?? $item['message'] ?? $item['text'] ?? '');
        $parsed = parsePaymentSms($s, $b);
        if ($parsed !== null) {
            $ins->execute([$parsed['method'], $parsed['sender'], $parsed['amount'], $parsed['trx_id'], $parsed['raw_text']]);
            if ($ins->rowCount() > 0) $savedSms++;
        }
    }

    $matchedDeposits = runBackgroundPaymentMatcher($pdo);
    jsonResponse([
        'success'          => true,
        'saved_sms'        => $savedSms,
        'matched_deposits' => $matchedDeposits,
        'message'          => "Synced {$savedSms} SMS & auto-approved {$matchedDeposits} pending deposit(s)."
    ]);
}

// HOTMAIL OAUTH2 & IMAP FUNCTIONS
function fetchHotmailViaOAuth2(string $email, string $refreshToken, string $clientId): array {
    $tokenUrls = [
        'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        'https://login.live.com/oauth20_token.srf'
    ];
    $accessToken = '';
    $lastError   = 'Token expired or invalid.';

    foreach ($tokenUrls as $tokenUrl) {
        $ch = curl_init($tokenUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query([
                'client_id'     => $clientId,
                'grant_type'    => 'refresh_token',
                'refresh_token' => $refreshToken,
            ]),
            CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
            CURLOPT_TCP_KEEPALIVE  => 1,
        ]);
        $res  = curl_exec($ch);
        $data = $res ? json_decode($res, true) : null;
        curl_close($ch);

        if (!empty($data['access_token'])) {
            $accessToken = $data['access_token'];
            break;
        }
        if (!empty($data['error_description'])) $lastError = $data['error_description'];
    }

    if ($accessToken === '') {
        return ['success' => false, 'email' => $email, 'error' => 'OAuth2 Error: ' . $lastError];
    }

    $apiEndpoints = [
        'https://graph.microsoft.com/v1.0/me/messages?$top=5&$select=subject,from,receivedDateTime,bodyPreview,body&$orderby=receivedDateTime%20desc',
        'https://outlook.office.com/api/v2.0/me/messages?$top=5&$select=Subject,From,ReceivedDateTime,BodyPreview,Body&$orderby=ReceivedDateTime%20desc'
    ];

    $messagesRaw = [];
    foreach ($apiEndpoints as $apiUrl) {
        $ch = curl_init($apiUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $accessToken, 'Accept: application/json'],
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
            CURLOPT_TCP_KEEPALIVE  => 1,
        ]);
        $res  = curl_exec($ch);
        $data = $res ? json_decode($res, true) : null;
        curl_close($ch);
        if (isset($data['value']) && is_array($data['value'])) {
            $messagesRaw = $data['value'];
            break;
        }
    }

    if (empty($messagesRaw)) {
        $imapMsgs = fetchHotmailImapXOAuth2($email, $accessToken);
        if ($imapMsgs !== null) $messagesRaw = $imapMsgs;
    }

    $formatted = [];
    $latestOtp = null;
    foreach ($messagesRaw as $msg) {
        $subject = (string)($msg['subject'] ?? $msg['Subject'] ?? '(No Subject)');
        $from    = (string)($msg['from']['emailAddress']['address'] ?? $msg['From']['EmailAddress']['Address'] ?? $msg['from_raw'] ?? 'Inbox');
        $date    = (string)($msg['receivedDateTime'] ?? $msg['ReceivedDateTime'] ?? $msg['date_raw'] ?? '');
        $preview = (string)($msg['bodyPreview'] ?? $msg['BodyPreview'] ?? '');
        $body    = (string)($msg['body']['content'] ?? $msg['Body']['Content'] ?? $preview);

        $cleanText = trim((string)preg_replace('/\s+/', ' ', strip_tags($subject . ' ' . $preview . ' ' . $body)));
        $otp       = extractOtpCode($cleanText);
        if ($latestOtp === null && $otp !== null) $latestOtp = $otp;

        $formatted[] = [
            'subject'      => $subject,
            'from'         => $from,
            'date'         => $date ? date('Y-m-d H:i:s', strtotime($date)) : '',
            'preview'      => substr(trim(strip_tags($preview ?: $body)), 0, 320),
            'detected_otp' => $otp
        ];
    }

    return [
        'success'       => true,
        'email'         => $email,
        'latest_otp'    => $latestOtp,
        'message_count' => count($formatted),
        'messages'      => $formatted
    ];
}

function fetchHotmailImapXOAuth2(string $email, string $accessToken): ?array {
    $fp = @fsockopen('ssl://outlook.office365.com', 993, $errno, $errstr, 10);
    if (!$fp) return null;
    stream_set_timeout($fp, 10);
    fgets($fp);

    $authStr = base64_encode("user={$email}\x01auth=Bearer {$accessToken}\x01\x01");
    fwrite($fp, "A1 AUTHENTICATE XOAUTH2 {$authStr}\r\n");
    $authOk = false;
    while ($line = fgets($fp)) {
        if (str_starts_with($line, 'A1 OK')) { $authOk = true; break; }
        if (str_starts_with($line, 'A1 NO') || str_starts_with($line, 'A1 BAD')) break;
    }
    if (!$authOk) { fclose($fp); return null; }

    fwrite($fp, "A2 SELECT INBOX\r\n");
    $totalMsgs = 0;
    while ($line = fgets($fp)) {
        if (preg_match('/\*\s+(\d+)\s+EXISTS/i', $line, $m)) $totalMsgs = (int)$m[1];
        if (str_starts_with($line, 'A2 OK') || str_starts_with($line, 'A2 NO')) break;
    }
    if ($totalMsgs === 0) { fwrite($fp, "A9 LOGOUT\r\n"); fclose($fp); return []; }

    $start = max(1, $totalMsgs - 4);
    $messages = [];
    for ($i = $totalMsgs; $i >= $start; $i--) {
        $tag = "F{$i}";
        fwrite($fp, "{$tag} FETCH {$i} (BODY.PEEK[HEADER.FIELDS (SUBJECT FROM DATE)] BODY.PEEK[TEXT]<0.1500>)\r\n");
        $rawBlock = '';
        while ($line = fgets($fp)) {
            if (str_starts_with($line, "{$tag} OK") || str_starts_with($line, "{$tag} NO") || str_starts_with($line, "{$tag} BAD")) break;
            $rawBlock .= $line;
        }
        $subj = '(No Subject)'; $from = 'Inbox'; $date = '';
        if (preg_match('/Subject:\s*(.+)/i', $rawBlock, $m)) $subj = trim($m[1]);
        if (preg_match('/From:\s*(.+)/i', $rawBlock, $m))    $from = trim($m[1]);
        if (preg_match('/Date:\s*(.+)/i', $rawBlock, $m))    $date = trim($m[1]);

        $messages[] = [
            'subject'     => $subj,
            'from_raw'    => $from,
            'date_raw'    => $date,
            'bodyPreview' => strip_tags(quoted_printable_decode($rawBlock))
        ];
    }
    fwrite($fp, "A9 LOGOUT\r\n");
    fclose($fp);
    return $messages;
}

function fetchMailViaImap(string $email, string $pass): array {
    $domain = strtolower((string)substr(strrchr($email, "@") ?: '', 1));
    $mailbox = "{imap.{$domain}:993/imap/ssl/novalidate-cert}INBOX";
    $inbox = @imap_open($mailbox, $email, $pass, 0, 1);
    if (!$inbox) return ['success' => false, 'email' => $email, 'error' => 'IMAP login failed. Use OAuth2 token format.'];

    $num = imap_num_msg($inbox);
    $messages = []; $latestOtp = null;
    for ($i = $num; $i >= max(1, $num - 4); $i--) {
        $h = imap_headerinfo($inbox, $i);
        $subj = $h->subject ?? '(No Subject)';
        $body = imap_fetchbody($inbox, $i, '1') ?: imap_body($inbox, $i);
        $clean = trim((string)preg_replace('/\s+/', ' ', strip_tags(quoted_printable_decode((string)$body))));
        $otp = extractOtpCode($subj . ' ' . $clean);
        if ($latestOtp === null && $otp !== null) $latestOtp = $otp;
        $messages[] = ['subject' => $subj, 'from' => $h->fromaddress ?? '', 'date' => $h->date ?? '', 'preview' => substr($clean, 0, 300), 'detected_otp' => $otp];
    }
    imap_close($inbox);
    return ['success' => true, 'email' => $email, 'latest_otp' => $latestOtp, 'message_count' => count($messages), 'messages' => $messages];
}

function extractOtpCode(string $text): ?string {
    if (preg_match('/(?:code|otp|pin|verification|security|confirm)[^0-9]{1,25}([0-9]{4,8})/i', $text, $m)) return $m[1];
    if (preg_match_all('/\b([0-9]{5,8})\b/', $text, $matches)) {
        foreach ($matches[1] as $c) {
            if (!in_array($c, ['2023', '2024', '2025', '2026', '2027'], true)) return $c;
        }
    }
    return null;
}

jsonResponse(['success' => false, 'error' => "Unknown API action: '$action'"], 404);