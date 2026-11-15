<?php
// ============================================================
//  MRMS MART v6.2 FAIL-SAFE CRYSTAL AQUA — index.php
//  Fail-Safe Splash + Clean Slash API Docs + .TXT Doc Download
// ============================================================

declare(strict_types=1);

require_once __DIR__ . '/db.php';

$pdo      = getDB();
$settings = getSettings($pdo);
$initUser = getCurrentUser($pdo);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title><?= htmlspecialchars(SITE_NAME) ?> — Instant Digital Store</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#f8fafc;
  --surface:rgba(255,255,255,.92);
  --surface-solid:#ffffff;
  --surface-alt:#f8fafc;
  --primary:#2563eb;
  --primary-dark:#1d4ed8;
  --primary-light:#eff6ff;
  --primary-border:#bfdbfe;
  --aqua:#0ea5e9;
  --text:#0f172a;
  --muted:#475569;
  --light:#94a3b8;
  --border:#e2e8f0;
  --success:#10b981;
  --success-bg:#ecfdf5;
  --warning:#f59e0b;
  --warning-bg:#fffbeb;
  --danger:#ef4444;
  --danger-bg:#fef2f2;
  --radius:14px;
  --shadow-float:0 8px 24px -4px rgba(15,23,42,.06), 0 2px 6px rgba(15,23,42,.04);
}
html{scroll-behavior:smooth}
body{
  font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;
  background:var(--bg);
  color:var(--text);min-height:100vh;display:flex;flex-direction:column;
  padding-bottom:78px;overflow-x:hidden;
}
code,pre,.mono{font-family:'JetBrains Mono',monospace}
i{line-height:1;vertical-align:middle}

/* ── FAIL-SAFE WELCOME SPLASH (AUTO HIDES VIA CSS AFTER 0.85s!) ── */
@keyframes autoHideSplash{
  0%,65%{opacity:1;visibility:visible}
  100%{opacity:0;visibility:hidden;pointer-events:none}
}
.splash-screen{
  position:fixed;inset:0;z-index:99999;
  background:#f8fafc;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  animation:autoHideSplash .85s ease forwards;
}
.splash-screen.hide{opacity:0;visibility:hidden;pointer-events:none}
.splash-logo-box{
  width:64px;height:64px;border-radius:19px;
  background:#eff6ff;border:1px solid #bfdbfe;
  color:#2563eb;display:flex;align-items:center;justify-content:center;font-size:32px;
  box-shadow:0 8px 20px rgba(37,99,235,.12);
}
.splash-title{margin-top:14px;font-size:20px;font-weight:800;color:var(--text)}
.splash-sub{font-size:11.5px;font-weight:600;color:var(--muted);margin-top:3px}
.splash-bar-track{width:150px;height:4px;background:#dbeafe;border-radius:99px;margin-top:14px;overflow:hidden;position:relative}
.splash-bar-fill{position:absolute;top:0;left:0;bottom:0;width:50%;border-radius:99px;background:linear-gradient(90deg,#2563eb,#0ea5e9);animation:splashSlide .6s ease-in-out infinite alternate}

/* ── TOP PROGRESS BAR ── */
.top-loader{
  position:fixed;top:0;left:0;height:3px;width:0%;z-index:9000;
  background:linear-gradient(90deg,#2563eb,#0ea5e9,#38bdf8);
  box-shadow:0 0 10px rgba(14,165,233,.8);
  transition:width .28s ease, opacity .28s ease;opacity:0;
}
.top-loader.active{width:82%;opacity:1}
.top-loader.done{width:100%;opacity:0}

@keyframes splashSlide{0%{left:-10%}100%{left:65%}}
@keyframes pageEnter{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
@keyframes cardCascade{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
@keyframes springModal{
  0%{opacity:0;transform:scale(.86) translateY(12px)}
  70%{transform:scale(1.02) translateY(-2px)}
  100%{opacity:1;transform:scale(1) translateY(0)}
}
@keyframes rippleWave{to{transform:scale(3.4);opacity:0}}
@keyframes spin360{to{transform:rotate(360deg)}}
.spin-anim{display:inline-block;animation:spin360 .65s linear infinite}

/* ── STYLE 4: CLEAN SOLID PILL BUTTONS & CARDS (MODERN FINTECH) ── */
.btn{
  padding:6px 11px;border-radius:9px;font-size:11.5px;font-weight:700;
  font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
  gap:4px;text-decoration:none;white-space:nowrap;position:relative;overflow:hidden;
  transition:all .16s cubic-bezier(.34,1.56,.64,1);user-select:none;line-height:1.2;
}
.btn-primary{
  background:#2563eb;
  color:#fff;border:1px solid #1d4ed8;
  box-shadow:0 2px 6px rgba(37,99,235,.18);
}
.btn-primary:hover{background:#1d4ed8;transform:translateY(-1px)}
.btn-primary:active{transform:translateY(1px) scale(.96)}

.btn-outline{
  background:#f8fafc;
  color:#1e293b;border:1px solid #cbd5e1;
  box-shadow:none;
}
.btn-outline:hover{background:#f1f5f9;border-color:#94a3b8;transform:translateY(-1px)}
.btn-outline:active{transform:scale(.96)}

.btn-ghost{
  background:#f8fafc;
  color:#475569;border:1px solid #e2e8f0;
  box-shadow:none;
}
.btn-ghost:active{transform:scale(.96)}

.btn-danger{
  background:#fff1f2;
  color:#e11d48;border:1px solid #fecdd3;
  box-shadow:none;
}
.btn-danger:active{transform:scale(.96)}

.ripple-effect{
  position:absolute;border-radius:50%;background:rgba(255,255,255,.55);
  transform:scale(0);animation:rippleWave .5s linear;pointer-events:none;
}

/* ── CLEAN SOLID TOP NAVBAR ── */
.navbar{
  position:sticky;top:0;z-index:100;height:54px;
  background:#ffffff;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  border-bottom:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(15,23,42,.03);
}
.nav-inner{
  max-width:1140px;margin:0 auto;padding:0 10px;height:100%;
  display:flex;align-items:center;justify-content:space-between;gap:6px;
}
.nav-left{display:flex;align-items:center;gap:7px;min-width:0}

.menu-btn{
  width:34px;height:34px;border-radius:9px;flex-shrink:0;
  background:#f8fafc;
  border:1px solid #cbd5e1;color:#0f172a;
  display:flex;align-items:center;justify-content:center;font-size:17px;
  cursor:pointer;
}

.brand{display:flex;align-items:center;gap:7px;cursor:pointer;min-width:0}
.brand-ico{
  width:34px;height:34px;border-radius:9px;flex-shrink:0;
  background:#eff6ff;border:1px solid #bfdbfe;
  color:#2563eb;display:flex;align-items:center;justify-content:center;font-size:17px;
}
.brand-name{
  font-size:14.5px;font-weight:800;letter-spacing:-.02em;color:#0f172a;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}

.nav-links{display:flex;align-items:center;gap:4px}
.nav-link{
  padding:5px 10px;border-radius:8px;border:1px solid transparent;background:transparent;
  color:#475569;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;
  display:flex;align-items:center;gap:5px;transition:all .16s;
}
.nav-link:hover{background:#f1f5f9;color:#0f172a}
.nav-link.active{
  background:#eff6ff;
  color:#1d4ed8;border-color:#bfdbfe;
}

.nav-right{display:flex;align-items:center;gap:6px;flex-shrink:0}
.bal-pill{
  background:#ecfdf5;
  border:1px solid #a7f3d0;color:#065f46;
  padding:5px 9px;border-radius:9px;font-size:11.5px;font-weight:800;
  cursor:pointer;display:flex;align-items:center;gap:5px;
}
.bal-pill i{color:#059669;font-size:14px}

/* ── RIGHT SLIDE DRAWER (3-LINE MENU) ── */
.drawer-ov{
  position:fixed;inset:0;background:rgba(15,23,42,.42);backdrop-filter:blur(4px);
  z-index:200;opacity:0;pointer-events:none;transition:opacity .25s ease;
}
.drawer-ov.open{opacity:1;pointer-events:auto}
.drawer{
  position:fixed;top:0;right:0;bottom:0;width:265px;background:#ffffff;
  z-index:210;transform:translateX(102%);transition:transform .28s cubic-bezier(.22,1,.36,1);
  display:flex;flex-direction:column;border-left:1px solid #e2e8f0;
  box-shadow:-10px 0 35px rgba(15,23,42,.12);
}
.drawer.open{transform:translateX(0)}
.drawer-head{
  padding:14px;border-bottom:1px solid #e2e8f0;display:flex;
  align-items:center;justify-content:space-between;
  background:#ffffff;
}
.drawer-body{padding:10px;flex:1;overflow-y:auto}
.d-sec{font-size:10px;font-weight:800;text-transform:uppercase;color:#64748b;padding:8px 10px 4px;letter-spacing:.06em}
.d-item{
  width:100%;padding:8px 10px;border-radius:10px;border:1px solid transparent;background:transparent;
  color:#1e293b;font-size:12.5px;font-weight:700;font-family:inherit;
  display:flex;align-items:center;gap:9px;cursor:pointer;text-align:left;margin-bottom:4px;
  transition:all .16s;
}
.d-item i{
  width:28px;height:28px;border-radius:8px;background:#eff6ff;
  color:#2563eb;display:flex;align-items:center;justify-content:center;font-size:15px;
  border:1px solid #bfdbfe;
}
#d-profile i{background:#eef2ff;color:#4f46e5;border-color:#c7d2fe}
#d-api-doc i{background:#f0fdfa;color:#0d9488;border-color:#99f6e4}
#d-shop i{background:#eff6ff;color:#2563eb;border-color:#bfdbfe}
#d-otp i{background:#f5f3ff;color:#7c3aed;border-color:#ddd6fe}
#d-orders i{background:#fffbeb;color:#d97706;border-color:#fde68a}
#d-deposit i{background:#ecfdf5;color:#059669;border-color:#a7f3d0}
.d-item:hover{background:#f8fafc;border-color:#e2e8f0}
.d-item.active{
  background:#eff6ff;
  color:#1d4ed8;border-color:#2563eb;
}
.d-item.active i{background:#2563eb !important;color:#fff !important;border-color:#2563eb !important}

/* ── MAIN CONTENT ── */
.container{max-width:1140px;width:100%;margin:0 auto;padding:12px 10px;flex:1}

.notice{
  background:#eff6ff;border:1px solid #bfdbfe;
  color:#1e3a8a;padding:8px 11px;border-radius:11px;font-size:11.5px;font-weight:700;
  margin-bottom:10px;display:flex;align-items:center;gap:8px;
}
.notice i{
  width:24px;height:24px;border-radius:7px;background:#dbeafe;color:#2563eb;
  display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;
}

.store-bar{
  background:#ffffff;
  border:1px solid #e2e8f0;
  border-radius:14px;padding:11px 13px;margin-bottom:10px;
  display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
  box-shadow:0 2px 8px rgba(15,23,42,.03);
}
.store-title{font-size:14px;font-weight:800;color:#0f172a;display:flex;align-items:center;gap:6px}
.store-title span{color:#2563eb}
.store-sub{font-size:11px;color:#64748b;margin-top:2px}
.store-counts{display:flex;gap:6px}
.s-pill{
  background:#f5f3ff;
  border:1px solid #ddd6fe;padding:4px 9px;border-radius:8px;
  font-size:11px;font-weight:800;color:#6d28d9;
  display:flex;align-items:center;gap:4px;
}
.s-pill i{color:#7c3aed}
.s-pill.s-stock{background:#ecfdf5;border-color:#a7f3d0;color:#047857}
.s-pill.s-stock i{color:#10b981}

.cat-scroll{
  display:flex;align-items:center;gap:6px;overflow-x:auto;padding:2px 2px 8px;margin-bottom:8px;
  scrollbar-width:none;
}
.cat-scroll::-webkit-scrollbar{display:none}
.cat-chip{
  padding:6px 11px;border-radius:9px;
  background:#ffffff;
  border:1px solid #cbd5e1;color:#1e293b;
  font-size:11.5px;font-weight:700;font-family:inherit;cursor:pointer;
  white-space:nowrap;display:inline-flex;align-items:center;gap:5px;
  transition:all .16s ease;
}
.cat-chip i{font-size:13.5px;color:#2563eb}
.cat-chip.active{
  background:#2563eb;
  color:#fff;border-color:#1d4ed8;
}
.cat-chip.active i{color:#fff !important}

/* ── COMPACT PRODUCT CARDS ── */
.prod-list{display:flex;flex-direction:column;gap:7px}
.p-card{
  background:#ffffff;border:1px solid #e2e8f0;
  border-radius:12px;padding:10px 11px;
  display:flex;align-items:center;justify-content:space-between;gap:9px;
  box-shadow:0 2px 6px rgba(15,23,42,.03);
  transition:transform .16s ease, border-color .16s ease;
  animation:cardCascade .25s ease backwards;
}
.p-card:hover{border-color:#93c5fd;transform:translateY(-1px)}
.p-left{display:flex;align-items:center;gap:9px;min-width:0;flex:1}
.p-ico{
  width:36px;height:36px;border-radius:9px;flex-shrink:0;
  background:#f0f9ff;
  border:1px solid #bae6fd;color:#0284c7;
  display:flex;align-items:center;justify-content:center;font-size:17px;
}
.p-info{min-width:0;flex:1}
.p-name{font-size:12.5px;font-weight:800;color:#0f172a;line-height:1.25}
.p-meta{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-top:3px}
.p-desc{font-size:10.5px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}
.stk-tag{font-size:10px;font-weight:800;padding:1.5px 6px;border-radius:6px;display:inline-flex;align-items:center;gap:3px}
.stk-ok{background:var(--success-bg);color:#059669;border:1px solid #a7f3d0}
.stk-low{background:var(--warning-bg);color:#d97706;border:1px solid #fde68a}
.stk-out{background:var(--danger-bg);color:var(--danger);border:1px solid #fecaca}

.p-right{display:flex;align-items:center;gap:7px;flex-shrink:0}
.p-price{text-align:right;margin-right:2px}
.p-price .val{font-size:13.5px;font-weight:800;color:#0f172a;display:block;line-height:1.1}
.p-price .lbl{font-size:9.5px;color:#94a3b8;font-weight:600}
.qty-box{
  width:40px;height:28px;border-radius:7px;border:1px solid #cbd5e1;
  background:#f8fafc;text-align:center;font-size:11.5px;font-weight:800;
  font-family:inherit;outline:none;color:#0f172a;
}

/* ── CARDS, FORMS & TABLES ── */
.card{
  background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;
  box-shadow:0 2px 8px rgba(15,23,42,.04);margin-bottom:12px;overflow:hidden;
}
.card-head{
  padding:10px 13px;border-bottom:1px solid #f1f5f9;
  background:#ffffff;
  display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;
}
.card-head h3{font-size:13px;font-weight:800;display:flex;align-items:center;gap:6px}
.card-head h3 i{color:var(--primary);font-size:15px}
.card-body{padding:13px}

.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.fg{margin-bottom:9px}
.fg label{display:block;font-size:10.5px;font-weight:700;color:var(--muted);margin-bottom:3px;text-transform:uppercase}
.fg input,.fg select,.fg textarea{
  width:100%;padding:7px 10px;border-radius:8px;border:1px solid var(--border);
  font-size:12px;font-family:inherit;outline:none;background:#fff;transition:.16s;
}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(37,99,235,.12)}

.tbl-wrap{overflow-x:auto}
.tbl{width:100%;border-collapse:collapse}
.tbl th{text-align:left;padding:8px 10px;font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase;background:var(--surface-alt);border-bottom:1px solid var(--border);white-space:nowrap}
.tbl td{padding:8px 10px;border-bottom:1px solid var(--border);font-size:11.5px;vertical-align:middle}

.badge{padding:2px 7px;border-radius:6px;font-size:10px;font-weight:800;display:inline-flex;align-items:center;gap:3px}
.b-ok{background:var(--success-bg);color:#059669;border:1px solid #a7f3d0}
.b-warn{background:var(--warning-bg);color:#d97706;border:1px solid #fde68a}
.b-err{background:var(--danger-bg);color:var(--danger);border:1px solid #fecaca}
.b-blue{background:var(--primary-light);color:var(--primary);border:1px solid var(--primary-border)}

.sec{display:none}
.sec.active{display:block;animation:pageEnter .25s ease}

/* API DOC BLOCKS */
.ep-card{border:1px solid var(--border);border-radius:10px;margin-bottom:12px;overflow:hidden}
.ep-head{padding:8px 11px;background:var(--surface-alt);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.ep-method{background:var(--primary);color:#fff;font-size:10px;font-weight:800;padding:2px 6px;border-radius:5px}
.ep-url{font-size:11px;font-weight:600;color:var(--text);word-break:break-all}
.code-pre{background:#0f172a;color:#e2e8f0;padding:10px;border-radius:8px;font-size:10.5px;overflow-x:auto;line-height:1.45;margin-top:6px}

/* ── CLEAN SOLID PILL BOTTOM NAVIGATION DOCK (FOR MOBILE) ── */
.mob-dock{
  display:none;position:fixed;bottom:8px;left:10px;right:10px;height:58px;
  background:#ffffff;
  border:1px solid #e2e8f0;border-radius:16px;z-index:120;
  grid-template-columns:repeat(4,1fr);padding:4px;gap:4px;
  box-shadow:0 8px 24px rgba(15,23,42,.08);
}
.dock-btn{
  border:none !important;background:transparent !important;box-shadow:none !important;outline:none !important;
  border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:2px;font-size:9.5px;font-weight:700;color:#64748b;
  font-family:inherit;cursor:pointer;transition:all .18s ease;
  position:relative;overflow:hidden;-webkit-appearance:none;appearance:none;
}
.dock-btn:hover,.dock-btn:focus,.dock-btn:focus-visible,.dock-btn:active,.dock-btn.active{
  background:transparent !important;border:none !important;box-shadow:none !important;outline:none !important;
}
.dock-ico-box{
  width:28px;height:26px;border-radius:8px;
  background:#eff6ff;
  border:1px solid #bfdbfe;color:#2563eb;
  display:flex;align-items:center;justify-content:center;font-size:14.5px;
  transition:all .18s ease;
}
#m-shop .dock-ico-box{background:#eff6ff;border-color:#bfdbfe;color:#2563eb}
#m-otp .dock-ico-box{background:#f5f3ff;border-color:#ddd6fe;color:#7c3aed}
#m-orders .dock-ico-box{background:#fffbeb;border-color:#fde68a;color:#d97706}
#m-deposit .dock-ico-box{background:#ecfdf5;border-color:#a7f3d0;color:#059669}
#m-shop.active{color:#2563eb;font-weight:800}
#m-shop.active .dock-ico-box{background:#2563eb;border-color:#2563eb;color:#fff;transform:translateY(-1px)}
#m-otp.active{color:#7c3aed;font-weight:800}
#m-otp.active .dock-ico-box{background:#7c3aed;border-color:#7c3aed;color:#fff;transform:translateY(-1px)}
#m-orders.active{color:#d97706;font-weight:800}
#m-orders.active .dock-ico-box{background:#d97706;border-color:#d97706;color:#fff;transform:translateY(-1px)}
#m-deposit.active{color:#059669;font-weight:800}
#m-deposit.active .dock-ico-box{background:#059669;border-color:#059669;color:#fff;transform:translateY(-1px)}

/* MODALS & TOAST */
.modal-ov{position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(4px);z-index:300;display:none;align-items:center;justify-content:center;padding:12px}
.modal-ov.show{display:flex}
.modal{background:#fff;border-radius:16px;width:100%;max-width:360px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.22);animation:springModal .28s ease}
.modal-head{padding:11px 14px;background:linear-gradient(135deg,var(--primary-light),#fff);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.modal-head h3{font-size:13.5px;font-weight:800;color:var(--primary-dark);display:flex;align-items:center;gap:6px}
.modal-body{padding:14px;max-height:80vh;overflow-y:auto}
.err-alert{background:var(--danger-bg);color:var(--danger);border:1px solid #fecaca;padding:7px 10px;border-radius:8px;font-size:11.5px;font-weight:600;margin-bottom:10px;display:none}

.toast{
  position:fixed;top:60px;right:12px;z-index:400;background:#0f172a;color:#fff;
  padding:8px 13px;border-radius:10px;font-size:11.5px;font-weight:700;
  display:none;align-items:center;gap:6px;box-shadow:0 10px 25px rgba(0,0,0,.25);
  animation:springModal .25s ease;
}
.toast.show{display:flex}

@media(max-width:768px){
  .nav-links{display:none}
  .mob-dock{display:grid}
  .grid-2{grid-template-columns:1fr}
  .p-desc{max-width:130px}
}
</style>
</head>
<body>

<!-- FAIL-SAFE SPLASH SCREEN -->
<div class="splash-screen" id="splashScreen" onclick="this.classList.add('hide')">
  <div class="splash-logo-box"><i class="ri-flashlight-fill"></i></div>
  <div class="splash-title"><?= htmlspecialchars(SITE_NAME) ?></div>
  <div class="splash-sub">Loading Instant Digital Inventory...</div>
  <div class="splash-bar-track"><div class="splash-bar-fill"></div></div>
</div>

<div class="top-loader" id="topLoader"></div>

<!-- LEFT SLIDE DRAWER (3-LINE MENU) -->
<div class="drawer-ov" id="drawerOv" onclick="toggleDrawer(false)"></div>
<aside class="drawer" id="drawer">
  <div class="drawer-head">
    <div class="brand" onclick="switchPage('shop');toggleDrawer(false)">
      <div class="brand-ico"><i class="ri-flashlight-fill"></i></div>
      <div class="brand-name"><?= htmlspecialchars(SITE_NAME) ?></div>
    </div>
    <button class="btn btn-ghost" style="padding:4px 8px" onclick="toggleDrawer(false)"><i class="ri-close-line"></i></button>
  </div>
  <div class="drawer-body">
    <div class="d-sec">Account & Developer</div>
    <button class="d-item" id="d-profile" onclick="openProfilePage()">
      <i class="ri-user-settings-fill"></i> <span>My Profile & API Key</span>
    </button>
    <button class="d-item" id="d-api-doc" onclick="switchPage('api-doc');toggleDrawer(false)">
      <i class="ri-code-box-fill"></i> <span>API Documentation</span>
    </button>

    <div class="d-sec" style="margin-top:8px">Store Navigation</div>
    <button class="d-item active" id="d-shop" onclick="switchPage('shop');toggleDrawer(false)">
      <i class="ri-store-2-fill"></i> <span>Buy Products (Shop)</span>
    </button>
    <button class="d-item" id="d-otp" onclick="switchPage('otp');toggleDrawer(false)">
      <i class="ri-mail-check-fill"></i> <span>Get Mail Code (OTP)</span>
    </button>
    <button class="d-item" id="d-orders" onclick="openProtectedPage('orders')">
      <i class="ri-shopping-bag-3-fill"></i> <span>My Orders History</span>
    </button>
    <button class="d-item" id="d-deposit" onclick="openProtectedPage('deposit')">
      <i class="ri-wallet-3-fill"></i> <span>Add Balance (Deposit)</span>
    </button>
  </div>
  <div style="padding:10px 12px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;flex-direction:column;gap:8px">
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#475569;font-weight:700">
      <span>Need Help?</span>
      <a href="<?= htmlspecialchars($settings['support_link'] ?? '#') ?>" target="_blank" class="btn btn-outline" style="padding:4px 9px;font-size:10.5px"><i class="ri-customer-service-2-fill" style="color:#2563eb"></i> Support</a>
    </div>
    <button class="btn btn-danger" id="drawerLogoutBtn" style="width:100%;padding:8px;display:none" onclick="toggleDrawer(false);doLogout()">
      <i class="ri-shut-down-line"></i> Sign Out / Logout
    </button>
  </div>
</aside>

<!-- COMPACT STICKY TOP NAVBAR -->
<header class="navbar">
  <div class="nav-inner">
    <div class="nav-left">
      <div class="brand" onclick="switchPage('shop')">
        <div class="brand-ico"><i class="ri-flashlight-fill"></i></div>
        <div class="brand-name"><?= htmlspecialchars(SITE_NAME) ?></div>
      </div>
    </div>

    <nav class="nav-links">
      <button class="nav-link active" id="tab-shop" onclick="switchPage('shop')"><i class="ri-store-2-fill" style="color:#2563eb"></i> Store</button>
      <button class="nav-link" id="tab-otp" onclick="switchPage('otp')"><i class="ri-mail-check-fill" style="color:#7c3aed"></i> Get OTP</button>
      <button class="nav-link" id="tab-orders" onclick="openProtectedPage('orders')"><i class="ri-shopping-bag-3-fill" style="color:#d97706"></i> Orders</button>
      <button class="nav-link" id="tab-deposit" onclick="openProtectedPage('deposit')"><i class="ri-wallet-3-fill" style="color:#059669"></i> Deposit</button>
      <button class="nav-link" id="tab-api-doc" onclick="switchPage('api-doc')"><i class="ri-code-s-slash-fill" style="color:#0d9488"></i> API Docs</button>
    </nav>

    <div class="nav-right">
      <div id="navAuthBox" style="display:flex;align-items:center;gap:5px"></div>
      <button class="menu-btn" onclick="toggleDrawer(true)" aria-label="Menu">
        <i class="ri-menu-3-fill"></i>
      </button>
    </div>
  </div>
</header>

<!-- MAIN CONTENT -->
<main class="container">

  <?php if (!empty($settings['site_notice'])): ?>
  <div class="notice">
    <i class="ri-megaphone-fill"></i>
    <span style="flex:1"><?= htmlspecialchars($settings['site_notice']) ?></span>
  </div>
  <?php endif; ?>

  <!-- 1. SHOP / HOME SECTION -->
  <section id="sec-shop" class="sec active">
    <div class="store-bar">
      <div>
        <div class="store-title"><i class="ri-sparkling-fill" style="color:#d97706"></i> Instant <span>Digital Account Store</span></div>
        <div class="store-sub">Tap any category below to filter. 100% automated instant delivery!</div>
      </div>
      <div class="store-counts">
        <div class="s-pill"><i class="ri-box-3-fill"></i> <span id="stProdCount">0</span> Items</div>
        <div class="s-pill s-stock"><i class="ri-database-2-fill"></i> <span id="stStockCount">0</span> Stock</div>
      </div>
    </div>

    <div class="cat-scroll" id="catBar">
      <button class="cat-chip active" onclick="filterCat('all', this)"><i class="ri-apps-2-fill"></i> All</button>
    </div>

    <div class="prod-list" id="prodList"></div>
  </section>

  <!-- 2. GET MAIL CODE (OTP) SECTION -->
  <section id="sec-otp" class="sec">
    <div class="card" style="max-width:680px;margin:0 auto">
      <div class="card-head">
        <h3><i class="ri-mail-open-line"></i> Read Mail & Extract OTP Code</h3>
        <span class="badge b-blue">OAuth2 / IMAP</span>
      </div>
      <div class="card-body">
        <p style="font-size:11.5px;color:var(--muted);margin-bottom:9px;line-height:1.45">
          Paste your purchased mail line (<code class="mono" style="color:var(--primary)">email|password|refresh_token|client_id</code>) to get verification codes:
        </p>
        <div class="fg">
          <input type="text" id="otpInput" class="mono" placeholder="user@hotmail.com|Pass123|M.C510_BAY...|9e5f94bc-e8a4...">
        </div>
        <button class="btn btn-primary" id="btnOtp" onclick="readMailOtp()"><i class="ri-search-eye-line"></i> Check Inbox & Get Code</button>
        <div id="otpResult" style="margin-top:12px;display:none"></div>
      </div>
    </div>
  </section>

  <!-- 3. MY ORDERS SECTION -->
  <section id="sec-orders" class="sec">
    <div class="card">
      <div class="card-head">
        <h3><i class="ri-shopping-bag-3-line"></i> My Purchased Orders</h3>
        <button class="btn btn-outline" onclick="loadOrders()"><i class="ri-refresh-line"></i> Refresh</button>
      </div>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Paid</th><th>Date</th><th>Action</th></tr></thead>
          <tbody id="ordersBody">
            <tr><td colspan="6" style="text-align:center;color:var(--muted)">No orders yet.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- 4. ADD BALANCE / OWN AUTO-PAYMENT GATEWAY SECTION -->
  <section id="sec-deposit" class="sec">
    <div class="grid-2">
      <div class="card">
        <div class="card-head">
          <h3><i class="ri-shield-flash-line"></i> MRMS Auto-Payment Gateway</h3>
          <span class="badge b-ok"><i class="ri-flashlight-fill"></i> Auto-Verify</span>
        </div>
        <div class="card-body">
          <!-- Method Selector Tabs (Filtered by Admin ON/OFF Settings) -->
          <div class="fg" style="margin-bottom:10px">
            <label>1. Choose Payment Method</label>
            <div id="payMethodTabs" style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px"></div>
            <input type="hidden" id="depMethod" value="bKash">
          </div>

          <!-- Dynamic Branded Gateway Instruction Box -->
          <div id="payGatewayBox" style="border-radius:11px;padding:11px 12px;margin-bottom:11px;color:#fff;background:linear-gradient(135deg,#e2136e,#b80d57);box-shadow:0 6px 16px rgba(226,19,110,0.2)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;opacity:.9" id="pgMethodTitle">bKash Send Money</span>
              <span style="background:rgba(255,255,255,0.2);padding:2px 7px;border-radius:99px;font-size:10px;font-weight:800">Min: <?= CURRENCY ?><span id="pgMinDep"><?= htmlspecialchars($settings['min_deposit'] ?? '50') ?></span></span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,0.22);padding:7px 10px;border-radius:8px;margin-bottom:6px">
              <div>
                <div style="font-size:9.5px;opacity:.8" id="pgNumLabel">Personal / Send Money Number</div>
                <div class="mono" style="font-size:14.5px;font-weight:800;letter-spacing:.4px" id="pgTargetNum"><?= htmlspecialchars($settings['bkash_number'] ?? '') ?></div>
              </div>
              <button type="button" class="btn" style="background:#fff;color:#0f172a;padding:5px 9px;font-size:11px;font-weight:800" onclick="copyGatewayNum()"><i class="ri-file-copy-line"></i> Copy</button>
            </div>
            <div style="font-size:10.5px;line-height:1.45;opacity:.95" id="pgStepHint">
              Send Money to the number above, take a screenshot, and submit the TrxID & Screenshot below.
            </div>
          </div>

          <!-- Optional Binance USDT Calculator (Only visible when Binance is selected) -->
          <div id="binanceCalcBox" style="display:none;background:#fefce8;border:1px solid #fde047;border-radius:9px;padding:8px 10px;margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:800;color:#854d0e;margin-bottom:5px">
              <span><i class="ri-coins-line"></i> Binance USDT Calculator</span>
              <span>Rate: 1 USDT = <?= CURRENCY ?><span id="lblUsdtRate"><?= htmlspecialchars($settings['binance_rate'] ?? '120') ?></span></span>
            </div>
            <div style="display:flex;gap:6px;align-items:center">
              <input type="number" step="0.01" id="depUsdtInput" oninput="calcUsdtToBdt()" placeholder="Enter USDT (e.g. 1)" style="flex:1;padding:6px 9px;border-radius:7px;border:1px solid #facc15;font-size:12px;font-weight:700;background:#fff">
              <span style="font-size:11px;font-weight:800;color:#854d0e">=</span>
              <span class="mono" id="lblConvertedBdt" style="font-size:12.5px;font-weight:800;color:#ca8a04;min-width:70px;text-align:right">৳0.00</span>
            </div>
          </div>

          <div id="payFormFields">
            <div class="fg"><label id="lblDepSender">Sender Number (Your Number)</label><input type="text" id="depSender" placeholder="017XXXXXXXX"></div>
            <div class="fg"><label>Amount Sent (<?= CURRENCY ?>)</label><input type="number" step="0.01" id="depAmount" placeholder="100"></div>
            <div class="fg"><label id="lblDepTrx">Transaction ID (TrxID)</label><input type="text" id="depTrx" placeholder="e.g. BHG7654321"></div>

            <!-- Screenshot Upload & Preview -->
            <div class="fg">
              <label><i class="ri-image-add-line"></i> Payment Screenshot (Required)</label>
              <input type="file" id="depScreenFile" accept="image/*" onchange="handleScreenshotSelect(this)" style="padding:6px;background:#f8fafc;border:1.5px dashed var(--primary-border);cursor:pointer;font-size:11.5px">
              <input type="hidden" id="depScreenData" value="">
              <div id="depScreenPreviewWrap" style="display:none;margin-top:7px;position:relative;border:1px solid var(--border);border-radius:8px;padding:6px;background:#f8fafc;text-align:center">
                <img id="depScreenPreviewImg" src="" alt="Screenshot Preview" style="max-height:130px;max-width:100%;border-radius:6px;object-fit:contain">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:10.5px;color:var(--primary-dark);font-weight:700">
                  <span><i class="ri-checkbox-circle-fill"></i> Screenshot Ready</span>
                  <button type="button" class="btn btn-ghost" style="padding:2px 7px;font-size:10px;color:var(--danger)" onclick="clearDepScreenshot()"><i class="ri-delete-bin-line"></i> Remove</button>
                </div>
              </div>
            </div>

            <button class="btn btn-primary" id="btnSubmitDep" style="width:100%;padding:9px" onclick="submitDeposit(event)"><i class="ri-shield-check-line"></i> Submit Payment for Auto-Verification</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <h3><i class="ri-history-line"></i> Deposit History</h3>
          <button class="btn btn-outline" onclick="loadDeposits()"><i class="ri-refresh-line"></i> Check Status</button>
        </div>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr><th>Method</th><th>Amount</th><th>TrxID</th><th>Status</th></tr></thead>
            <tbody id="depBody">
              <tr><td colspan="4" style="text-align:center;color:var(--muted)">No deposits found.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. MY PROFILE & API KEY ACCESS -->
  <section id="sec-profile" class="sec">
    <div class="grid-2">
      <div class="card">
        <div class="card-head"><h3><i class="ri-user-line"></i> Edit Profile</h3></div>
        <div class="card-body">
          <div class="fg"><label>Full Name</label><input type="text" id="profName"></div>
          <div class="fg"><label>Email Address</label><input type="email" id="profEmail"></div>
          <button class="btn btn-primary" onclick="saveProfile()"><i class="ri-save-line"></i> Save Profile</button>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h3><i class="ri-lock-password-line"></i> Change Password</h3></div>
        <div class="card-body">
          <div class="fg"><label>Current Password</label><input type="password" id="profCurPass"></div>
          <div class="fg"><label>New Password</label><input type="password" id="profNewPass"></div>
          <button class="btn btn-primary" onclick="savePassword()"><i class="ri-key-line"></i> Update Password</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <h3><i class="ri-key-2-line"></i> Reseller API Key Access</h3>
        <span class="badge b-warn" id="apiBadge">Checking...</span>
      </div>
      <div class="card-body" id="apiControlBox"></div>
    </div>
  </section>

  <!-- 6. PROFESSIONAL BOT & RESELLER API DOCUMENTATION + .TXT DOWNLOAD -->
  <section id="sec-api-doc" class="sec">
    <div class="card">
      <div class="card-head">
        <h3><i class="ri-robot-2-line"></i> Telegram Bot & Reseller API Documentation</h3>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span class="badge b-blue"><i class="ri-speed-up-line"></i> 60 req/min</span>
          <button class="btn btn-primary" onclick="downloadApiDocTxt()"><i class="ri-file-download-line"></i> Download Full Doc (.TXT)</button>
        </div>
      </div>
      <div class="card-body">
        <div style="background:linear-gradient(135deg,var(--primary-light),#ffffff);border:1px solid var(--primary-border);border-radius:11px;padding:11px 13px;margin-bottom:14px;font-size:11.5px;line-height:1.55">
          <div style="font-weight:800;color:var(--primary-dark);margin-bottom:3px"><i class="ri-information-line"></i> Clean Slash (<code class="mono">/</code>) API Structure for Easy Bot Building:</div>
          Every API URL starts with your approved <code class="mono" style="color:var(--primary);font-weight:700">API_KEY</code> followed by <code class="mono">/</code> and the command.
          <div style="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span>Your Active Key:</span>
            <code class="mono doc-key" style="background:#fff;padding:2px 8px;border-radius:6px;border:1px solid var(--primary-border);color:var(--primary-dark);font-weight:800">YOUR_API_KEY</code>
            <button class="btn btn-outline" style="padding:3px 8px;font-size:10px" onclick="openProfilePage()"><i class="ri-key-2-line"></i> Get / Manage Key</button>
          </div>
        </div>

        <!-- STEP 1: CATEGORIES -->
        <div class="ep-card">
          <div class="ep-head" style="justify-content:space-between">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="ep-method">STEP 1 • GET</span>
              <span class="ep-url mono" id="epUrl1"><?= htmlspecialchars(SITE_URL) ?>/api.php/<span class="doc-key">YOUR_API_KEY</span>/categories</span>
            </div>
            <button class="btn btn-outline" style="padding:3px 8px;font-size:10px" onclick="navigator.clipboard.writeText(document.getElementById('epUrl1').innerText);showToast('URL Copied!')"><i class="ri-file-copy-line"></i> Copy</button>
          </div>
          <div style="padding:11px 13px">
            <b style="font-size:12px;color:var(--primary-dark)">1. Load Categories (To Show Category Buttons in Bot)</b>
            <pre class="code-pre">{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Hotmail / Outlook",
      "category_code": "mail",
      "total_products": 3
    }
  ]
}</pre>
          </div>
        </div>

        <!-- STEP 2: PRODUCTS & STOCK -->
        <div class="ep-card">
          <div class="ep-head" style="justify-content:space-between">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="ep-method">STEP 2 • GET</span>
              <span class="ep-url mono" id="epUrl2"><?= htmlspecialchars(SITE_URL) ?>/api.php/<span class="doc-key">YOUR_API_KEY</span>/products/mail</span>
            </div>
            <button class="btn btn-outline" style="padding:3px 8px;font-size:10px" onclick="navigator.clipboard.writeText(document.getElementById('epUrl2').innerText);showToast('URL Copied!')"><i class="ri-file-copy-line"></i> Copy</button>
          </div>
          <div style="padding:11px 13px">
            <b style="font-size:12px;color:var(--primary-dark)">2. Load Products & Live Stock Under a Category</b>
            <p style="font-size:11px;color:var(--muted);margin-top:2px">
              When a user clicks a category button (e.g. <code class="mono">mail</code>), call this URL to show products, price, and live stock! (Omit <code class="mono">/mail</code> to get all products, or use <code class="mono">/stock/hotmail</code> for a single product).
            </p>
            <pre class="code-pre">{
  "success": true,
  "category": "mail",
  "currency": "<?= CURRENCY ?>",
  "products": [
    {
      "product_id": 1,
      "name": "Hotmail Fresh OAuth2",
      "product_code": "hotmail",
      "category": "mail",
      "price": 2.00,
      "stock": 450,
      "description": "Added: 13 Nov | OAuth2 Enabled",
      "full_details": "Full product requirements, rules & login instructions..."
    }
  ]
}</pre>
          </div>
        </div>

        <!-- STEP 3: INSTANT BUY PRODUCT -->
        <div class="ep-card">
          <div class="ep-head" style="justify-content:space-between">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="ep-method">STEP 3 • BUY</span>
              <span class="ep-url mono" id="epUrl3"><?= htmlspecialchars(SITE_URL) ?>/api.php/<span class="doc-key">YOUR_API_KEY</span>/buy/hotmail/5</span>
            </div>
            <button class="btn btn-outline" style="padding:3px 8px;font-size:10px" onclick="navigator.clipboard.writeText(document.getElementById('epUrl3').innerText);showToast('URL Copied!')"><i class="ri-file-copy-line"></i> Copy</button>
          </div>
          <div style="padding:11px 13px">
            <b style="font-size:12px;color:var(--primary-dark)">3. Instant Buy Product (After User Enters Quantity)</b>
            <p style="font-size:11px;color:var(--muted);margin-top:2px">
              Format: <code class="mono">/buy/{product_code_or_id}/{quantity}</code>. Deducts balance and returns the delivered accounts in <code class="mono">items</code> array.
            </p>
            <pre class="code-pre">{
  "success": true,
  "order_code": "ORD-8F92A1B3",
  "product_id": 1,
  "product": "Hotmail Fresh OAuth2",
  "product_code": "hotmail",
  "qty": 2,
  "unit_price": 2.00,
  "total_price": 4.00,
  "new_balance": 496.00,
  "items": [
    "user1@hotmail.com|Pass123|M.C510_BAY...|9e5f94bc-e8a4...",
    "user2@hotmail.com|Pass456|M.C510_BAY...|9e5f94bc-e8a4..."
  ]
}</pre>
          </div>
        </div>

        <!-- STEP 4: GET MAIL OTP CODE -->
        <div class="ep-card">
          <div class="ep-head" style="justify-content:space-between">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="ep-method">STEP 4 • OTP</span>
              <span class="ep-url mono" id="epUrl4"><?= htmlspecialchars(SITE_URL) ?>/api.php/<span class="doc-key">YOUR_API_KEY</span>/code/EMAIL|PASS|TOKEN|CLIENT_ID</span>
            </div>
            <button class="btn btn-outline" style="padding:3px 8px;font-size:10px" onclick="navigator.clipboard.writeText(document.getElementById('epUrl4').innerText);showToast('URL Copied!')"><i class="ri-file-copy-line"></i> Copy</button>
          </div>
          <div style="padding:11px 13px">
            <b style="font-size:12px;color:var(--primary-dark)">4. Read Mail Inbox & Extract Verification Code (OTP)</b>
            <pre class="code-pre">{
  "success": true,
  "email": "user1@hotmail.com",
  "latest_otp": "583920",
  "message_count": 1,
  "messages": [
    {
      "subject": "Your verification code is 583920",
      "from": "security@facebookmail.com",
      "date": "2026-11-12 16:30:00",
      "detected_otp": "583920"
    }
  ]
}</pre>
          </div>
        </div>

        <!-- STEP 5: CHECK WALLET BALANCE -->
        <div class="ep-card" style="margin-bottom:0">
          <div class="ep-head" style="justify-content:space-between">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="ep-method">STEP 5 • GET</span>
              <span class="ep-url mono" id="epUrl5"><?= htmlspecialchars(SITE_URL) ?>/api.php/<span class="doc-key">YOUR_API_KEY</span>/balance</span>
            </div>
            <button class="btn btn-outline" style="padding:3px 8px;font-size:10px" onclick="navigator.clipboard.writeText(document.getElementById('epUrl5').innerText);showToast('URL Copied!')"><i class="ri-file-copy-line"></i> Copy</button>
          </div>
          <div style="padding:11px 13px">
            <b style="font-size:12px;color:var(--primary-dark)">5. Check Reseller Wallet Balance</b>
            <pre class="code-pre">{
  "success": true,
  "name": "Reseller Name",
  "balance": 496.00,
  "currency": "<?= CURRENCY ?>",
  "api_status": "approved"
}</pre>
          </div>
        </div>

      </div>
    </div>
  </section>

</main>

<!-- FLOATING CLEAN SOLID PILL BOTTOM DOCK -->
<nav class="mob-dock">
  <button class="dock-btn active" id="m-shop" onclick="switchPage('shop')">
    <span class="dock-ico-box"><i class="ri-store-2-fill"></i></span>
    <span>Store</span>
  </button>
  <button class="dock-btn" id="m-otp" onclick="switchPage('otp')">
    <span class="dock-ico-box"><i class="ri-mail-check-fill"></i></span>
    <span>Get OTP</span>
  </button>
  <button class="dock-btn" id="m-orders" onclick="openProtectedPage('orders')">
    <span class="dock-ico-box"><i class="ri-shopping-bag-3-fill"></i></span>
    <span>Orders</span>
  </button>
  <button class="dock-btn" id="m-deposit" onclick="openProtectedPage('deposit')">
    <span class="dock-ico-box"><i class="ri-wallet-3-fill"></i></span>
    <span>Deposit</span>
  </button>
</nav>

<!-- COMPACT AUTH MODAL (LOGIN / REGISTER) -->
<div class="modal-ov" id="authModal">
  <div class="modal">
    <div class="modal-head">
      <h3 id="authTitle"><i class="ri-shield-user-line"></i> Sign In</h3>
      <button class="btn btn-ghost" style="padding:3px 7px" onclick="closeModal('authModal')"><i class="ri-close-line"></i></button>
    </div>
    <div class="modal-body">
      <div style="display:flex;gap:5px;margin-bottom:11px">
        <button class="btn btn-primary" style="flex:1;padding:7px" id="btnTabLogin" onclick="setAuthMode('login')"><i class="ri-login-circle-line"></i> Sign In</button>
        <button class="btn btn-ghost" style="flex:1;padding:7px" id="btnTabReg" onclick="setAuthMode('register')"><i class="ri-user-add-line"></i> Register</button>
      </div>

      <div class="err-alert" id="authErrorBox"></div>

      <?php $gClientId = trim($settings['google_client_id'] ?? '') ?: '606638148564-at6p4i35b1gk7ntvlrd25cc05mrq9b3d.apps.googleusercontent.com'; ?>
      <?php if ($gClientId !== ''): ?>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:12px">
        <div id="g_id_onload"
             data-client_id="<?= htmlspecialchars($gClientId) ?>"
             data-context="signin"
             data-ux_mode="popup"
             data-callback="handleGoogleCredential"
             data-auto_prompt="false">
        </div>
        <div class="g_id_signin"
             data-type="standard"
             data-shape="rectangular"
             data-theme="outline"
             data-text="continue_with"
             data-size="large"
             data-logo_alignment="left"
             data-width="300">
        </div>
        <div style="width:100%;display:flex;align-items:center;gap:8px;margin-top:12px;color:var(--light);font-size:10px;font-weight:800">
          <span style="flex:1;height:1px;background:var(--border)"></span>
          <span>OR CONTINUE WITH EMAIL</span>
          <span style="flex:1;height:1px;background:var(--border)"></span>
        </div>
      </div>
      <?php endif; ?>

      <form onsubmit="submitAuthForm(event)">
        <div class="fg" id="nameField" style="display:none">
          <label>Full Name</label>
          <input type="text" id="authName" placeholder="Your Name">
        </div>
        <div class="fg">
          <label>Email Address</label>
          <input type="email" id="authEmail" placeholder="name@example.com" required>
        </div>
        <div class="fg">
          <label>Password</label>
          <input type="password" id="authPass" placeholder="Minimum 4 characters" required>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;padding:8px" id="btnAuthGo"><i class="ri-arrow-right-circle-line"></i> Continue</button>
      </form>
    </div>
  </div>
</div>

<!-- BULK BUY & PRODUCT REQUIREMENTS MODAL -->
<div class="modal-ov" id="buyPopupModal">
  <div class="modal" style="max-width:410px">
    <div class="modal-head">
      <h3><i class="ri-shopping-bag-3-line"></i> <span id="bpTitle">Buy Product</span></h3>
      <button class="btn btn-ghost" style="padding:4px 8px" onclick="closeModal('buyPopupModal')" title="Cancel & Close"><i class="ri-close-line"></i></button>
    </div>
    <div class="modal-body">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;background:var(--surface-alt);padding:8px 11px;border-radius:10px;border:1px solid var(--border)">
        <div>
          <div style="font-size:10px;color:var(--muted);font-weight:700">UNIT PRICE</div>
          <div style="font-size:14.5px;font-weight:800;color:var(--primary)" id="bpUnitPrice">৳0.00</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;color:var(--muted);font-weight:700">AVAILABLE STOCK</div>
          <span class="stk-tag stk-ok" id="bpStockBadge">0 pcs</span>
        </div>
      </div>

      <!-- Full Product Requirements / Introduction Box -->
      <div style="margin-bottom:12px">
        <div style="font-size:10.5px;font-weight:800;color:var(--primary-dark);text-transform:uppercase;margin-bottom:4px;display:flex;align-items:center;gap:4px">
          <i class="ri-information-line"></i> Product Requirements & Details
        </div>
        <div id="bpFullDesc" style="background:var(--primary-light);border:1px solid var(--primary-border);border-radius:10px;padding:10px 12px;font-size:11.5px;color:var(--text);line-height:1.55;max-height:140px;overflow-y:auto;white-space:pre-wrap"></div>
      </div>

      <!-- Quantity Selector (- [Typeable Input] +) -->
      <div class="fg" style="margin-bottom:12px">
        <label style="text-align:center;margin-bottom:6px">Select or Type Quantity to Buy</label>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px">
          <button type="button" class="btn btn-outline" style="width:38px;height:36px;font-size:16px;padding:0" onclick="stepBuyQty(-1)"><i class="ri-subtract-line"></i></button>
          <input type="number" id="bpQtyInput" value="1" min="1" oninput="updateBuyTotal()" style="width:110px;height:36px;text-align:center;font-size:15px;font-weight:800;border-radius:10px;border:1.5px solid var(--primary);color:var(--primary-dark)">
          <button type="button" class="btn btn-outline" style="width:38px;height:36px;font-size:16px;padding:0" onclick="stepBuyQty(1)"><i class="ri-add-line"></i></button>
        </div>
      </div>

      <!-- Live Total Payable Summary -->
      <div style="display:flex;justify-content:space-between;align-items:center;background:#0f172a;color:#fff;padding:10px 13px;border-radius:10px;margin-bottom:12px">
        <span style="font-size:11.5px;font-weight:700;color:#94a3b8">Total Payable:</span>
        <span class="mono" style="font-size:16px;font-weight:800;color:#38bdf8" id="bpTotalPayable">৳0.00</span>
      </div>

      <div style="display:flex;gap:8px">
        <button type="button" class="btn btn-ghost" style="flex:1;padding:9px" onclick="closeModal('buyPopupModal')"><i class="ri-close-line"></i> Cancel</button>
        <button type="button" class="btn btn-primary" style="flex:2;padding:9px" id="btnConfirmBuyPopup" onclick="confirmBuyFromPopup()"><i class="ri-Check-double-line"></i> Confirm & Buy Now</button>
      </div>
    </div>
  </div>
</div>

<!-- ORDER DELIVERY MODAL -->
<div class="modal-ov" id="orderModal">
  <div class="modal" style="max-width:460px">
    <div class="modal-head">
      <h3><i class="ri-checkbox-circle-line"></i> Delivered Accounts</h3>
      <button class="btn btn-ghost" style="padding:3px 7px" onclick="closeModal('orderModal')"><i class="ri-close-line"></i></button>
    </div>
    <div class="modal-body">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:9px">
        <span class="badge b-blue mono" id="mdlOrderCode">ORD</span>
        <div style="display:flex;gap:5px">
          <button class="btn btn-outline" onclick="copyDelivered()"><i class="ri-file-copy-line"></i> Copy</button>
          <a class="btn btn-primary" id="mdlTxt" href="#" target="_blank"><i class="ri-download-2-line"></i> .TXT</a>
          <a class="btn btn-ghost" id="mdlCsv" href="#" target="_blank"><i class="ri-file-excel-2-line"></i> .CSV</a>
        </div>
      </div>
      <textarea id="mdlItems" rows="8" class="mono" readonly style="width:100%;padding:9px;border-radius:8px;border:1px solid var(--border);font-size:11px;background:#f8fafc"></textarea>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const CURRENCY = <?= json_encode(CURRENCY) ?>;
const SITE_URL = <?= json_encode(SITE_URL) ?>;
const SITE_NAME = <?= json_encode(SITE_NAME) ?>;

let currentUser = <?= json_encode($initUser ? [
    'id' => (int)$initUser['id'],
    'name' => $initUser['name'],
    'email' => $initUser['email'],
    'balance' => (float)$initUser['balance'],
    'api_status' => $initUser['api_status'],
    'api_key' => $initUser['api_status'] === 'approved' ? $initUser['api_key'] : null
] : null) ?>;

let categories = [];
let products   = [];
let activeCat  = 'all';
let authMode   = 'login';

let payConfig = <?= json_encode([
    'bkash_status'   => isPaymentMethodEnabled($settings['bkash_status'] ?? '1'),
    'bkash_number'   => $settings['bkash_number'] ?? '',
    'nagad_status'   => isPaymentMethodEnabled($settings['nagad_status'] ?? '1'),
    'nagad_number'   => $settings['nagad_number'] ?? '',
    'binance_status' => isPaymentMethodEnabled($settings['binance_status'] ?? '1'),
    'binance_id'     => $settings['binance_id'] ?? '',
    'binance_rate'   => (float)($settings['binance_rate'] ?? 120),
    'min_deposit'    => (float)($settings['min_deposit'] ?? 50),
]) ?>;

document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn, .menu-btn, .cat-chip, .d-item');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const sp = document.createElement('span');
  const sz = Math.max(r.width, r.height);
  sp.style.width = sp.style.height = sz + 'px';
  sp.style.left = (e.clientX - r.left - sz / 2) + 'px';
  sp.style.top  = (e.clientY - r.top - sz / 2) + 'px';
  sp.className  = 'ripple-effect';
  btn.appendChild(sp);
  setTimeout(() => sp.remove(), 500);
});

function startLoad() { document.getElementById('topLoader').className = 'top-loader active'; }
function endLoad() {
  const l = document.getElementById('topLoader');
  l.className = 'top-loader done';
  setTimeout(() => l.className = 'top-loader', 280);
}

function syncPageFromUrl() {
  const hash = location.hash.replace('#', '').trim();
  const validPages = ['shop', 'otp', 'orders', 'deposit', 'profile', 'api-doc'];
  if (hash && validPages.includes(hash) && hash !== 'shop') {
    if (['orders', 'deposit', 'profile'].includes(hash) && !currentUser) {
      switchPage('shop');
    } else {
      switchPage(hash, false);
    }
  } else {
    switchPage('shop', false);
  }
}

window.addEventListener('hashchange', syncPageFromUrl);

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('splashScreen').classList.add('hide');
  renderNavAuth();
  renderPaymentGatewayUI();
  syncPageFromUrl();
  if (location.hash.replace('#', '').trim() && location.hash.replace('#', '').trim() !== 'shop') {
    loadCatalog();
  }

  // Instant Live Sync Function (Updates Categories, Stock, Balance, Deposits & Profile)
  async function liveSyncUserPanel() {
    if (document.hidden) return;
    await loadCatalog();
    const activeSec = document.querySelector('.sec.active');
    if (activeSec && currentUser) {
      if (activeSec.id === 'sec-deposit') loadDeposits();
      if (activeSec.id === 'sec-orders') loadOrders();
      if (activeSec.id === 'sec-profile') loadProfile();
    }
  }

  // 1. Sync immediately the moment you switch back to the User tab!
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) liveSyncUserPanel();
  });
  window.addEventListener('focus', liveSyncUserPanel);

  // 2. Also sync automatically every 15 seconds while watching (Saves Server CPU)!
  setInterval(liveSyncUserPanel, 15000);
});

async function manualReloadStore() {
  const ico = document.getElementById('reloadIco');
  ico.classList.add('spin-anim');
  startLoad();
  await loadCatalog();
  const activeSec = document.querySelector('.sec.active');
  if (activeSec && currentUser) {
    if (activeSec.id === 'sec-deposit') await loadDeposits();
    if (activeSec.id === 'sec-orders') await loadOrders();
    if (activeSec.id === 'sec-profile') await loadProfile();
  }
  endLoad();
  setTimeout(() => ico.classList.remove('spin-anim'), 500);
  showToast('Store & wallet synced!');
}

function toggleDrawer(open) {
  document.getElementById('drawer').classList.toggle('open', open);
  document.getElementById('drawerOv').classList.toggle('open', open);
}

function showToast(msg, isErr = false) {
  const t = document.getElementById('toast');
  t.style.background = isErr ? '#e11d48' : '#0f172a';
  t.innerHTML = `<i class="${isErr ? 'ri-error-warning-line' : 'ri-checkbox-circle-line'}"></i> ` + esc(msg);
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function switchPage(id, updateUrl = true) {
  if (updateUrl) {
    if (id === 'shop') {
      history.pushState(null, null, window.location.pathname);
    } else {
      history.pushState(null, null, '#' + id);
    }
  }
  startLoad();
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link, .dock-btn, .d-item').forEach(b => b.classList.remove('active'));

  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');

  ['tab-', 'm-', 'd-'].forEach(prefix => {
    const el = document.getElementById(prefix + id);
    if (el) el.classList.add('active');
  });

  if (id === 'shop') loadCatalog();
  if (id === 'orders') loadOrders();
  if (id === 'deposit') { loadDeposits(); loadCatalog(); }
  if (id === 'profile') loadProfile();
  if (id === 'api-doc') updateDocApiKeys();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(endLoad, 220);
}

function updateDocApiKeys() {
  const key = (currentUser && currentUser.api_key) ? currentUser.api_key : 'YOUR_API_KEY';
  document.querySelectorAll('.doc-key').forEach(el => el.textContent = key);
}

function downloadApiDocTxt() {
  const key  = (currentUser && currentUser.api_key) ? currentUser.api_key : 'YOUR_API_KEY';
  const base = SITE_URL + '/api.php/' + key;
  const lines = [
    "===================================================================",
    "  " + SITE_NAME + " — OFFICIAL BOT & RESELLER API DOCUMENTATION",
    "  Base URL   : " + SITE_URL + "/api.php",
    "  Your Key   : " + key,
    "  Rate Limit : 60 Requests / Minute",
    "===================================================================",
    "",
    "TELEGRAM BOT / RESELLER WORKFLOW:",
    "-------------------------------------------------------------------",
    "Step 1 (Categories)     : " + base + "/categories",
    "Step 2 (Cat Products)   : " + base + "/products/mail",
    "Step 2b (All Products)  : " + base + "/products",
    "Step 2c (Single Stock)  : " + base + "/stock/hotmail",
    "Step 3 (Buy Accounts)   : " + base + "/buy/hotmail/5",
    "Step 4 (Read Mail OTP)  : " + base + "/code/EMAIL|PASS|REFRESH_TOKEN|CLIENT_ID",
    "Step 5 (Check Balance)  : " + base + "/balance",
    "",
    "===================================================================",
    "1. GET ALL CATEGORIES (FOR BOT MENU BUTTONS)",
    "===================================================================",
    "GET " + base + "/categories",
    "",
    "JSON Response:",
    '{\n  "success": true,\n  "categories": [\n    {\n      "id": 1,\n      "name": "Hotmail / Outlook",\n      "category_code": "mail",\n      "total_products": 3\n    }\n  ]\n}',
    "",
    "===================================================================",
    "2. GET PRODUCTS & LIVE STOCK (BY CATEGORY OR ALL)",
    "===================================================================",
    "GET " + base + "/products/mail",
    "",
    "JSON Response:",
    '{\n  "success": true,\n  "category": "mail",\n  "currency": "' + CURRENCY + '",\n  "products": [\n    {\n      "product_id": 1,\n      "name": "Hotmail Fresh OAuth2",\n      "product_code": "hotmail",\n      "category": "mail",\n      "price": 2.00,\n      "stock": 450,\n      "description": "Short 1-line note",\n      "full_details": "Full product requirements, rules & login instructions..."\n    }\n  ]\n}',
    "",
    "===================================================================",
    "3. INSTANT BUY PRODUCT (AUTOMATED DELIVERY)",
    "===================================================================",
    "GET/POST " + base + "/buy/hotmail/5",
    "",
    "JSON Response:",
    '{\n  "success": true,\n  "order_code": "ORD-8F92A1B3",\n  "product": "Hotmail Fresh OAuth2",\n  "qty": 2,\n  "total_price": 4.00,\n  "new_balance": 496.00,\n  "items": [\n    "user1@hotmail.com|Pass123|M.C510_BAY...|9e5f94bc-e8a4...",\n    "user2@hotmail.com|Pass456|M.C510_BAY...|9e5f94bc-e8a4..."\n  ]\n}',
    "",
    "===================================================================",
    "4. READ MAIL INBOX & GET VERIFICATION OTP CODE",
    "===================================================================",
    "GET/POST " + base + "/code/EMAIL|PASSWORD|REFRESH_TOKEN|CLIENT_ID",
    "",
    "JSON Response:",
    '{\n  "success": true,\n  "email": "user1@hotmail.com",\n  "latest_otp": "583920",\n  "messages": [\n    {\n      "subject": "Your verification code is 583920",\n      "from": "security@facebookmail.com",\n      "detected_otp": "583920"\n    }\n  ]\n}',
    "",
    "===================================================================",
    "5. CHECK RESELLER WALLET BALANCE",
    "===================================================================",
    "GET " + base + "/balance",
    "",
    "JSON Response:",
    '{\n  "success": true,\n  "name": "Reseller",\n  "balance": 496.00,\n  "currency": "' + CURRENCY + '",\n  "api_status": "approved"\n}',
    "==================================================================="
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = SITE_NAME.replace(/[^a-zA-Z0-9]+/g, '_') + '_API_Docs.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('API Documentation (.TXT) downloaded!');
}

function openProtectedPage(id) {
  toggleDrawer(false);
  if (!currentUser) return openAuthModal('login');
  switchPage(id);
}

function openProfilePage() {
  toggleDrawer(false);
  if (!currentUser) return openAuthModal('login');
  switchPage('profile');
}

function renderNavAuth() {
  const box = document.getElementById('navAuthBox');
  const dLogout = document.getElementById('drawerLogoutBtn');
  if (!currentUser) {
    if (dLogout) dLogout.style.display = 'none';
    box.innerHTML = `
      <button class="btn btn-outline" onclick="openAuthModal('login')"><i class="ri-login-circle-line"></i> Sign In</button>
      <button class="btn btn-primary" onclick="openAuthModal('register')"><i class="ri-user-add-line"></i> Join</button>
    `;
  } else {
    if (dLogout) dLogout.style.display = 'inline-flex';
    box.innerHTML = `
      <div class="bal-pill" onclick="openProtectedPage('deposit')" title="Add Balance">
        <i class="ri-wallet-3-fill"></i> ${CURRENCY}${Number(currentUser.balance).toFixed(2)}
      </div>
    `;
  }
  updateDocApiKeys();
}

function getCatIconHtml(ico, color = '') {
  const cls = (ico && ico.startsWith('ri-')) ? ico.replace('-line', '-fill') : 'ri-mail-star-fill';
  const st = color ? ` style="color:${color}"` : '';
  return `<i class="${esc(cls)}"${st}></i>`;
}

const CAT_PALETTES = [
  { color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { color: '#e11d48', bg: '#fff1f2', border: '#fecdd3' },
  { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
];

let lastCatalogSignature = '';
let lastUserSignature    = '';

async function loadCatalog() {
  try {
    const res  = await fetch('api.php?action=web_catalog&_t=' + Date.now(), { cache: 'no-store' });
    const data = await res.json();
    if (!data.success) return;

    // 1. Only update top balance/user bar if user balance or status actually changed
    if (data.user !== undefined) {
      const newUserSig = JSON.stringify(data.user);
      if (newUserSig !== lastUserSignature) {
        lastUserSignature = newUserSig;
        currentUser = data.user;
        renderNavAuth();
      }
    }

    // 1.5 Sync Payment Gateway Config (ON/OFF methods, numbers, USDT rate)
    if (data.payment_config) {
      payConfig = data.payment_config;
      renderPaymentGatewayUI();
    }

    // 2. Only re-render categories & product boxes if stock, price, or products actually changed!
    const newCatSig = JSON.stringify({ c: data.categories, p: data.products, s: data.total_stock });
    if (newCatSig === lastCatalogSignature) {
      return; // Nothing changed -> Do NOT touch DOM or jump!
    }
    lastCatalogSignature = newCatSig;

    if (activeCat !== 'all' && !(data.categories || []).some(c => c.slug === activeCat)) {
      activeCat = 'all';
    }

    categories = data.categories || [];
    products   = data.products || [];

    document.getElementById('stProdCount').textContent  = products.length;
    document.getElementById('stStockCount').textContent = Number(data.total_stock || 0).toLocaleString();

    renderCategories();
    renderProducts();
  } catch (e) {}
}

function renderCategories() {
  const bar = document.getElementById('catBar');
  let html = `<button class="cat-chip ${activeCat === 'all' ? 'active' : ''}" onclick="filterCat('all', this)"><i class="ri-apps-2-fill"></i> All</button>`;
  categories.forEach((c, idx) => {
    const act = activeCat === c.slug ? 'active' : '';
    const pal = CAT_PALETTES[idx % CAT_PALETTES.length];
    const activeStyle = act ? `style="background:${pal.color};border-color:${pal.color};color:#fff"` : '';
    html += `<button class="cat-chip ${act}" ${activeStyle} onclick="filterCat('${esc(c.slug)}', this)">${getCatIconHtml(c.icon, act ? '#fff' : pal.color)} ${esc(c.name)}</button>`;
  });
  bar.innerHTML = html;
}

function filterCat(slug, btn) {
  activeCat = slug;
  renderCategories();
  renderProducts();
}

function renderProducts() {
  const list = document.getElementById('prodList');
  const filtered = activeCat === 'all' ? products : products.filter(p => p.category === activeCat);

  if (!filtered.length) {
    list.innerHTML = `<div class="card"><div class="card-body" style="text-align:center;color:var(--muted);padding:24px"><i class="ri-inbox-2-fill" style="font-size:24px;color:var(--primary)"></i><div style="margin-top:6px;font-size:12px;font-weight:700">No products in this category</div></div></div>`;
    return;
  }

  const catMap = {};
  const catIdxMap = {};
  categories.forEach((c, i) => {
    catMap[c.slug] = c;
    catIdxMap[c.slug] = i;
  });

  list.innerHTML = filtered.map((p, idx) => {
    const c = catMap[p.category] || { name: p.category, icon: 'ri-box-3-fill' };
    const cIdx = catIdxMap[p.category] !== undefined ? catIdxMap[p.category] : idx;
    const pal = CAT_PALETTES[cIdx % CAT_PALETTES.length];
    const stk = Number(p.stock);
    const stkCls = stk === 0 ? 'stk-out' : (stk < 20 ? 'stk-low' : 'stk-ok');
    const stkTxt = stk === 0 ? 'Out of Stock' : `Stock: ${stk}`;

    return `
      <div class="p-card" style="animation-delay:${Math.min(idx * 0.04, 0.35)}s">
        <div class="p-left">
          <div class="p-ico" style="background:${pal.bg};border-color:${pal.border};color:${pal.color}">${getCatIconHtml(c.icon, pal.color)}</div>
          <div class="p-info">
            <div class="p-name">${esc(p.name)}</div>
            <div class="p-meta">
              <span class="stk-tag ${stkCls}"><i class="ri-checkbox-blank-circle-fill" style="font-size:6px"></i> ${stkTxt}</span>
              ${p.description ? `<span class="p-desc">${esc(p.description)}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="p-right">
          <div class="p-price">
            <span class="val">${CURRENCY}${Number(p.price).toFixed(2)}</span>
            <span class="lbl">per pc</span>
          </div>
          <button class="btn ${stk > 0 ? 'btn-primary' : 'btn-ghost'}" style="padding:7px 13px" onclick="openBuyPopup(${p.id})" ${stk === 0 ? 'disabled' : ''}>
            <i class="${stk > 0 ? 'ri-shopping-cart-2-fill' : 'ri-forbid-line'}"></i> ${stk > 0 ? 'Buy' : 'Sold'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

let selectedBuyProd = null;

function openBuyPopup(prodId) {
  if (!currentUser) return openAuthModal('login');
  const p = products.find(x => Number(x.id) === Number(prodId));
  if (!p || Number(p.stock) <= 0) return showToast('Product is out of stock!', true);

  selectedBuyProd = p;
  document.getElementById('bpTitle').textContent      = p.name;
  document.getElementById('bpUnitPrice').textContent  = CURRENCY + Number(p.price).toFixed(2) + ' / pc';
  document.getElementById('bpStockBadge').textContent = p.stock + ' pcs available';

  const fullText = (p.full_description && p.full_description.trim() !== '')
    ? p.full_description
    : (p.description && p.description.trim() !== '' ? p.description : '• Instant automated delivery right after purchase.\n• Make sure to read all rules before buying.');
  document.getElementById('bpFullDesc').textContent = fullText;

  const qInput = document.getElementById('bpQtyInput');
  qInput.value = 1;
  qInput.max   = p.stock;
  updateBuyTotal();

  document.getElementById('buyPopupModal').classList.add('show');
}

function stepBuyQty(delta) {
  if (!selectedBuyProd) return;
  const qInput = document.getElementById('bpQtyInput');
  let val = parseInt(qInput.value || '1', 10) + delta;
  if (isNaN(val) || val < 1) val = 1;
  if (val > Number(selectedBuyProd.stock)) val = Number(selectedBuyProd.stock);
  qInput.value = val;
  updateBuyTotal();
}

function updateBuyTotal() {
  if (!selectedBuyProd) return;
  const qInput = document.getElementById('bpQtyInput');
  let val = parseInt(qInput.value, 10);
  if (isNaN(val) || val < 1) val = 1;
  if (val > Number(selectedBuyProd.stock)) {
    val = Number(selectedBuyProd.stock);
    qInput.value = val;
  }
  const total = val * Number(selectedBuyProd.price);
  document.getElementById('bpTotalPayable').textContent = CURRENCY + total.toFixed(2);
}

async function confirmBuyFromPopup() {
  if (!selectedBuyProd) return;
  const qty = parseInt(document.getElementById('bpQtyInput').value || '1', 10) || 1;
  const btn = document.getElementById('btnConfirmBuyPopup');
  const oldHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line spin-anim"></i> Processing...';
  startLoad();

  const fd = new FormData();
  fd.append('action', 'buy');
  fd.append('slug', selectedBuyProd.slug);
  fd.append('qty', qty);

  try {
    const res  = await fetch('api.php', { method: 'POST', body: fd });
    const data = await res.json();
    endLoad();
    btn.disabled = false;
    btn.innerHTML = oldHtml;

    if (!data.success) return showToast(data.error, true);

    closeModal('buyPopupModal');
    showToast(`Purchased ${data.qty}x ${data.product}!`);
    currentUser.balance = data.new_balance;
    renderNavAuth();
    lastCatalogSignature = ''; // Force immediate stock refresh
    loadCatalog();
    openDeliveryModal(data.order_code, data.items);
  } catch (e) {
    endLoad();
    btn.disabled = false;
    btn.innerHTML = oldHtml;
    showToast('Network error! Please try again.', true);
  }
}

function openDeliveryModal(code, items) {
  document.getElementById('mdlOrderCode').textContent = code;
  document.getElementById('mdlItems').value = (items || []).join('\n');
  document.getElementById('mdlTxt').href = `api.php?action=download_order&order_code=${encodeURIComponent(code)}&format=txt`;
  document.getElementById('mdlCsv').href = `api.php?action=download_order&order_code=${encodeURIComponent(code)}&format=csv`;
  document.getElementById('orderModal').classList.add('show');
}

function copyDelivered() {
  const el = document.getElementById('mdlItems');
  el.select();
  navigator.clipboard.writeText(el.value);
  showToast('Copied all accounts!');
}

function openAuthModal(mode) {
  setAuthMode(mode);
  document.getElementById('authErrorBox').style.display = 'none';
  document.getElementById('authModal').classList.add('show');
}
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
function setAuthMode(mode) {
  authMode = mode;
  document.getElementById('nameField').style.display = mode === 'register' ? 'block' : 'none';
  document.getElementById('authTitle').innerHTML = mode === 'register' ? '<i class="ri-user-add-line"></i> Create Account' : '<i class="ri-shield-user-line"></i> Sign In';
  document.getElementById('btnTabLogin').className = mode === 'login' ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('btnTabReg').className   = mode === 'register' ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('authErrorBox').style.display = 'none';
}

async function submitAuthForm(e) {
  e.preventDefault();
  const errBox = document.getElementById('authErrorBox');
  const btn    = document.getElementById('btnAuthGo');
  errBox.style.display = 'none';

  const fd = new FormData();
  fd.append('action', authMode);
  if (authMode === 'register') fd.append('name', document.getElementById('authName').value.trim());
  fd.append('email', document.getElementById('authEmail').value.trim());
  fd.append('password', document.getElementById('authPass').value);

  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line spin-anim"></i> Processing...';
  startLoad();

  try {
    const res  = await fetch('api.php', { method: 'POST', body: fd });
    const data = await res.json();
    endLoad();
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-arrow-right-circle-line"></i> Continue';

    if (!data.success) {
      errBox.textContent = data.error || 'Authentication failed';
      errBox.style.display = 'block';
      return;
    }

    currentUser = data.user;
    renderNavAuth();
    closeModal('authModal');
    showToast(data.message);
  } catch (err) {
    endLoad();
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-arrow-right-circle-line"></i> Continue';
    errBox.textContent = 'Network error occurred.';
    errBox.style.display = 'block';
  }
}

async function handleGoogleCredential(response) {
  if (!response || !response.credential) return;
  startLoad();
  const fd = new FormData();
  fd.append('action', 'google_login');
  fd.append('credential', response.credential);

  try {
    const res  = await fetch('api.php', { method: 'POST', body: fd });
    const data = await res.json();
    endLoad();
    if (!data.success) {
      const errBox = document.getElementById('authErrorBox');
      errBox.textContent = data.error || 'Google Sign-In failed';
      errBox.style.display = 'block';
      return;
    }
    currentUser = data.user;
    renderNavAuth();
    closeModal('authModal');
    showToast(data.message || 'Signed in with Google!');
  } catch (e) {
    endLoad();
    showToast('Network error during Google Sign-In', true);
  }
}

async function doLogout() {
  startLoad();
  const fd = new FormData(); fd.append('action', 'logout');
  await fetch('api.php', { method: 'POST', body: fd });
  endLoad();
  currentUser = null;
  renderNavAuth();
  switchPage('shop');
  showToast('Logged out.');
}

async function readMailOtp() {
  const line = document.getElementById('otpInput').value.trim();
  const btn  = document.getElementById('btnOtp');
  const box  = document.getElementById('otpResult');
  if (!line) return showToast('Paste account line first!', true);

  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line spin-anim"></i> Checking Inbox...';
  box.style.display = 'none';
  startLoad();

  const fd = new FormData();
  fd.append('action', 'get_otp');
  fd.append('web_client', '1');
  fd.append('account', line);

  try {
    const res  = await fetch('api.php', { method: 'POST', body: fd });
    const data = await res.json();
    endLoad();
    box.style.display = 'block';

    if (!data.success) {
      box.innerHTML = `<div style="background:var(--danger-bg);color:var(--danger);padding:9px 11px;border-radius:8px;font-size:11.5px;font-weight:700"><i class="ri-error-warning-line"></i> ${esc(data.error)}</div>`;
    } else {
      let html = '';
      if (data.latest_otp) {
        html += `
          <div style="background:var(--primary-light);border:2px dashed var(--primary);padding:12px;border-radius:10px;text-align:center;margin-bottom:10px">
            <div style="font-size:10px;font-weight:800;color:var(--primary)">LATEST OTP CODE</div>
            <div class="mono" style="font-size:24px;font-weight:800;color:var(--primary-dark);margin:4px 0">${esc(data.latest_otp)}</div>
            <button class="btn btn-primary" onclick="navigator.clipboard.writeText('${esc(data.latest_otp)}');showToast('OTP Copied!')"><i class="ri-file-copy-line"></i> Copy Code</button>
          </div>`;
      }
      if (data.messages && data.messages.length) {
        html += data.messages.map(m => `
          <div style="border:1px solid var(--border);border-radius:8px;padding:9px;margin-bottom:6px">
            <div style="font-weight:800;font-size:12px">${esc(m.subject)}</div>
            <div style="font-size:10px;color:var(--primary);margin:2px 0">${esc(m.from)} • ${esc(m.date)}</div>
            <div style="font-size:11px;color:var(--muted)">${esc(m.preview)}</div>
          </div>`).join('');
      } else {
        html += `<div style="text-align:center;color:var(--muted);font-size:11.5px">Inbox is empty.</div>`;
      }
      box.innerHTML = html;
    }
  } catch (e) { endLoad(); }
  btn.disabled = false;
  btn.innerHTML = '<i class="ri-search-eye-line"></i> Check Inbox & Get Code';
}

async function loadOrders() {
  const res  = await fetch('api.php?action=orders');
  const data = await res.json();
  const body = document.getElementById('ordersBody');
  if (!data.success || !data.orders.length) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--muted)">No orders yet.</td></tr>`;
    return;
  }
  window.myOrders = data.orders;
  body.innerHTML = data.orders.map((o, i) => `
    <tr>
      <td class="mono" style="font-weight:800;color:var(--primary)">${esc(o.order_code)}</td>
      <td><b>${esc(o.product)}</b></td>
      <td>${o.qty}</td>
      <td><b>${CURRENCY}${Number(o.total_price).toFixed(2)}</b></td>
      <td style="font-size:10.5px;color:var(--muted)">${esc(o.created_at)}</td>
      <td><button class="btn btn-outline" onclick="openDeliveryModal(window.myOrders[${i}].order_code, window.myOrders[${i}].items)"><i class="ri-eye-line"></i> View</button></td>
    </tr>
  `).join('');
}

function isMethodOn(v) {
  return v !== false && v !== 0 && v !== '0' && String(v).toLowerCase() !== 'off' && String(v).toLowerCase() !== 'false';
}

function renderPaymentGatewayUI(selectedOverride) {
  const tabsEl = document.getElementById('payMethodTabs');
  if (!tabsEl) return;

  const methods = [
    { key: 'bKash', label: 'bKash', active: isMethodOn(payConfig.bkash_status), num: payConfig.bkash_number || '', color: '#e2136e', grad: 'linear-gradient(135deg,#e2136e,#b80d57)', icon: 'ri-smartphone-line' },
    { key: 'Nagad', label: 'Nagad', active: isMethodOn(payConfig.nagad_status), num: payConfig.nagad_number || '', color: '#f7941d', grad: 'linear-gradient(135deg,#f7941d,#d9531e)', icon: 'ri-smartphone-line' },
    { key: 'Binance', label: 'Binance', active: isMethodOn(payConfig.binance_status), num: payConfig.binance_id || '', color: '#d97706', grad: 'linear-gradient(135deg,#1e2329,#3b424c)', icon: 'ri-bit-coin-line' }
  ].filter(m => m.active);

  const boxEl   = document.getElementById('payGatewayBox');
  const formEl  = document.getElementById('payFormFields');
  const calcEl  = document.getElementById('binanceCalcBox');
  const curInput = document.getElementById('depMethod');

  if (!methods.length) {
    tabsEl.innerHTML = `<div style="grid-column:span 3;padding:10px;background:var(--danger-bg);color:var(--danger);border-radius:8px;font-size:11.5px;font-weight:700;text-align:center"><i class="ri-error-warning-line"></i> All payment methods are currently turned OFF by Admin.</div>`;
    if (boxEl) boxEl.style.display = 'none';
    if (formEl) formEl.style.display = 'none';
    if (calcEl) calcEl.style.display = 'none';
    return;
  }

  if (boxEl) boxEl.style.display = 'block';
  if (formEl) formEl.style.display = 'block';

  let current = selectedOverride || (curInput ? curInput.value : 'bKash');
  if (!methods.some(m => m.key === current)) {
    current = methods[0].key;
  }
  if (curInput) curInput.value = current;

  tabsEl.innerHTML = methods.map(m => {
    const isSel = m.key === current;
    return `
      <button type="button" onclick="renderPaymentGatewayUI('${m.key}')" style="display:flex;align-items:center;justify-content:center;gap:5px;padding:8px 6px;border-radius:9px;font-size:11.5px;font-weight:800;cursor:pointer;transition:.15s;border:${isSel ? '2px solid ' + m.color : '1px solid var(--border)'};background:${isSel ? '#fff' : '#f8fafc'};color:${isSel ? m.color : 'var(--muted)'};box-shadow:${isSel ? '0 3px 10px rgba(0,0,0,0.06)' : 'none'}">
        <i class="${m.icon}"></i> ${m.label}
      </button>
    `;
  }).join('');

  const sel = methods.find(m => m.key === current) || methods[0];
  if (boxEl) {
    boxEl.style.background = sel.grad;
    document.getElementById('pgMethodTitle').textContent = sel.key === 'Binance' ? 'Binance Pay (Auto-API Verify)' : `${sel.label} Personal (Send Money)`;
    document.getElementById('pgMinDep').textContent      = payConfig.min_deposit || 50;
    document.getElementById('pgNumLabel').textContent    = sel.key === 'Binance' ? 'Binance Pay ID / UID' : `${sel.label} Personal Number`;
    document.getElementById('pgTargetNum').textContent   = sel.num || 'Not Configured';
    document.getElementById('pgStepHint').textContent    = sel.key === 'Binance'
      ? `Send USDT via Binance Pay to the ID above (Rate: 1 USDT = ${CURRENCY}${payConfig.binance_rate || 120}). Enter your Binance Order ID / TrxID & Screenshot below.`
      : `Send Money to the ${sel.label} number above. Then enter your Sender Number, Amount, TrxID & Payment Screenshot below.`;
  }

  if (calcEl) {
    calcEl.style.display = sel.key === 'Binance' ? 'block' : 'none';
    const rateEl = document.getElementById('lblUsdtRate');
    if (rateEl) rateEl.textContent = payConfig.binance_rate || 120;
  }

  const lblSender = document.getElementById('lblDepSender');
  const inpSender = document.getElementById('depSender');
  const lblTrx    = document.getElementById('lblDepTrx');
  const inpTrx    = document.getElementById('depTrx');

  if (sel.key === 'Binance') {
    if (lblSender) lblSender.textContent = 'Your Binance Name / Pay ID';
    if (inpSender) inpSender.placeholder = 'e.g. Binance UID or Name';
    if (lblTrx) lblTrx.textContent       = 'Binance Order ID / TrxID';
    if (inpTrx) inpTrx.placeholder       = 'e.g. 29384756102938';
  } else {
    if (lblSender) lblSender.textContent = `Sender ${sel.label} Number`;
    if (inpSender) inpSender.placeholder = '017XXXXXXXX';
    if (lblTrx) lblTrx.textContent       = `${sel.label} Transaction ID (TrxID)`;
    if (inpTrx) inpTrx.placeholder       = 'e.g. BHG7654321';
  }
}

function copyGatewayNum() {
  const txt = document.getElementById('pgTargetNum').textContent.trim();
  if (!txt) return;
  navigator.clipboard.writeText(txt);
  showToast('Payment ID / Number Copied!');
}

function calcUsdtToBdt() {
  const usdt = parseFloat(document.getElementById('depUsdtInput').value || '0');
  const rate = parseFloat(payConfig.binance_rate || 120);
  const bdt  = Math.round(usdt * rate * 100) / 100;
  document.getElementById('lblConvertedBdt').textContent = CURRENCY + (bdt > 0 ? bdt.toFixed(2) : '0.00');
  if (bdt > 0) {
    document.getElementById('depAmount').value = bdt;
  }
}

function handleScreenshotSelect(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image screenshot!', true);
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      const maxDim = 650;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
        else { w = Math.round(w * (maxDim / h)); h = maxDim; }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
      document.getElementById('depScreenData').value = compressedDataUrl;
      document.getElementById('depScreenPreviewImg').src = compressedDataUrl;
      document.getElementById('depScreenPreviewWrap').style.display = 'block';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearDepScreenshot() {
  document.getElementById('depScreenFile').value = '';
  document.getElementById('depScreenData').value = '';
  document.getElementById('depScreenPreviewImg').src = '';
  document.getElementById('depScreenPreviewWrap').style.display = 'none';
}

async function submitDeposit(ev) {
  const btn = (ev && ev.currentTarget) ? ev.currentTarget : document.getElementById('btnSubmitDep');
  if (btn && btn.disabled) return;

  const method     = document.getElementById('depMethod').value;
  const senderNum  = document.getElementById('depSender').value.trim();
  const amount     = document.getElementById('depAmount').value.trim();
  const trxId      = document.getElementById('depTrx').value.trim();
  const screenData = document.getElementById('depScreenData').value.trim();

  if (!senderNum || !amount || !trxId) {
    return showToast('Please fill Sender Number, Amount and TrxID!', true);
  }
  if (!screenData) {
    return showToast('Please upload your Payment Screenshot!', true);
  }

  const oldHtml = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ri-loader-4-line spin-anim"></i> Submitting & Checking...'; }
  startLoad();

  const fd = new FormData();
  fd.append('action', 'deposit');
  fd.append('method', method);
  fd.append('sender_num', senderNum);
  fd.append('amount', amount);
  fd.append('trx_id', trxId);
  fd.append('screenshot_data', screenData);

  try {
    const res  = await fetch('api.php', { method: 'POST', body: fd });
    const data = await res.json();
    endLoad();
    if (btn) { btn.disabled = false; btn.innerHTML = oldHtml; }
    if (!data.success) return showToast(data.error, true);
    showToast(data.message);
    document.getElementById('depTrx').value = '';
    document.getElementById('depAmount').value = '';
    if (document.getElementById('depUsdtInput')) document.getElementById('depUsdtInput').value = '';
    clearDepScreenshot();
    loadDeposits();
    loadCatalog(); // Sync balance if auto-approved immediately!
  } catch (e) {
    endLoad();
    if (btn) { btn.disabled = false; btn.innerHTML = oldHtml; }
    showToast('Weak network connection! Please try again.', true);
  }
}

async function loadDeposits() {
  renderPaymentGatewayUI();
  const res  = await fetch('api.php?action=deposits&_t=' + Date.now(), { cache: 'no-store' });
  const data = await res.json();
  const body = document.getElementById('depBody');
  if (!data.success || !data.deposits.length) {
    body.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted)">No deposits yet.</td></tr>`;
    return;
  }
  body.innerHTML = data.deposits.map(d => {
    const cls = d.status === 'approved' ? 'b-ok' : (d.status === 'rejected' ? 'b-err' : 'b-warn');
    const statusText = d.status === 'pending'
      ? 'PENDING (Wait few minutes for approval)'
      : d.status.toUpperCase();
    return `
      <tr>
        <td><b>${esc(d.method)}</b></td>
        <td><b>${CURRENCY}${Number(d.amount).toFixed(2)}</b></td>
        <td class="mono">${esc(d.trx_id)}</td>
        <td><span class="badge ${cls}">${esc(statusText)}</span></td>
      </tr>`;
  }).join('');
}

async function loadProfile() {
  const res  = await fetch('api.php?action=me');
  const data = await res.json();
  if (data.success) { currentUser = data; renderNavAuth(); }
  document.getElementById('profName').value  = currentUser.name || '';
  document.getElementById('profEmail').value = currentUser.email || '';

  const badge = document.getElementById('apiBadge');
  const box   = document.getElementById('apiControlBox');
  const st    = currentUser.api_status || 'none';

  if (st === 'approved') {
    badge.className = 'badge b-ok'; badge.textContent = 'APPROVED';
    box.innerHTML = `
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <input type="text" readonly class="mono" id="myKeyField" value="${esc(currentUser.api_key || '')}" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--primary-border);background:var(--primary-light);font-weight:700;color:var(--primary-dark);font-size:11.5px">
        <button class="btn btn-outline" onclick="navigator.clipboard.writeText(document.getElementById('myKeyField').value);showToast('API Key Copied!')"><i class="ri-file-copy-line"></i> Copy</button>
        <button class="btn btn-primary" onclick="regenKey()"><i class="ri-refresh-line"></i> New Key</button>
      </div>`;
  } else if (st === 'pending') {
    badge.className = 'badge b-warn'; badge.textContent = 'PENDING APPROVAL';
    box.innerHTML = `<div style="font-size:12px;color:#b45309"><i class="ri-time-line"></i> Your API Key request is pending Admin approval.</div>`;
  } else if (st === 'revoked') {
    badge.className = 'badge b-err'; badge.textContent = 'REVOKED';
    box.innerHTML = `<div style="font-size:12px;color:var(--danger)"><i class="ri-forbid-line"></i> Your API access was revoked by Admin.</div>`;
  } else {
    badge.className = 'badge b-blue'; badge.textContent = 'NOT REQUESTED';
    box.innerHTML = `
      <p style="font-size:11.5px;color:var(--muted);margin-bottom:8px">Request Reseller API Key access to connect your Telegram bot or external website.</p>
      <button class="btn btn-primary" onclick="reqApi()"><i class="ri-rocket-line"></i> Request API Access</button>`;
  }
}

async function saveProfile() {
  const fd = new FormData();
  fd.append('action', 'update_profile');
  fd.append('name', document.getElementById('profName').value.trim());
  fd.append('email', document.getElementById('profEmail').value.trim());
  const r = await fetch('api.php', { method: 'POST', body: fd });
  const d = await r.json();
  if (!d.success) return showToast(d.error, true);
  currentUser.name = d.name; currentUser.email = d.email;
  renderNavAuth(); showToast(d.message);
}

async function savePassword() {
  const fd = new FormData();
  fd.append('action', 'change_password');
  fd.append('current_password', document.getElementById('profCurPass').value);
  fd.append('new_password', document.getElementById('profNewPass').value);
  const r = await fetch('api.php', { method: 'POST', body: fd });
  const d = await r.json();
  if (!d.success) return showToast(d.error, true);
  document.getElementById('profCurPass').value = '';
  document.getElementById('profNewPass').value = '';
  showToast(d.message);
}

async function reqApi() {
  const fd = new FormData(); fd.append('action', 'request_api');
  const r = await fetch('api.php', { method: 'POST', body: fd });
  const d = await r.json();
  if (!d.success) return showToast(d.error, true);
  showToast(d.message); loadProfile();
}

async function regenKey() {
  const fd = new FormData(); fd.append('action', 'regenerate_api');
  const r = await fetch('api.php', { method: 'POST', body: fd });
  const d = await r.json();
  if (!d.success) return showToast(d.error, true);
  showToast(d.message); loadProfile();
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
</script>
</body>
</html>