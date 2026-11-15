/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { DuotoneIcon, IconStylePreset } from './components/DuotoneIcon';

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  status: 'active' | 'inactive';
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  full_description: string;
  status: 'active' | 'inactive';
  stockLines: string[];
}

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  password?: string;
  balance: number;
  api_key: string | null;
  api_status: 'none' | 'pending' | 'approved' | 'revoked';
  status: 'active' | 'banned';
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_code: string;
  user_id: number;
  user_email: string;
  product_id: number;
  product_name: string;
  qty: number;
  unit_price: number;
  total_price: number;
  items: string[];
  buy_source: 'web' | 'api';
  created_at: string;
}

export interface DepositItem {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  method: string;
  sender_num: string;
  trx_id: string;
  amount: number;
  screenshot?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface StoreSettings {
  site_name: string;
  site_url: string;
  currency: string;
  bkash_status: '1' | '0';
  bkash_number: string;
  nagad_status: '1' | '0';
  nagad_number: string;
  binance_status: '1' | '0';
  binance_id: string;
  binance_rate: string;
  binance_api_key: string;
  binance_api_secret: string;
  sms_sync_secret: string;
  min_deposit: string;
  support_link: string;
  site_notice: string;
  google_client_id: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Hotmail / Outlook', slug: 'mail', icon: 'ri-mail-line', sort_order: 1, status: 'active' },
  { id: 2, name: 'Gmail Accounts', slug: 'gmail', icon: 'ri-google-fill', sort_order: 2, status: 'active' },
  { id: 3, name: 'Residential Proxy', slug: 'proxy', icon: 'ri-global-line', sort_order: 3, status: 'active' },
  { id: 4, name: 'Social Cookies', slug: 'cookie', icon: 'ri-facebook-circle-fill', sort_order: 4, status: 'active' },
  { id: 5, name: 'Cloud RDP / VPS', slug: 'rdp', icon: 'ri-server-line', sort_order: 5, status: 'active' },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Hotmail Fresh OAuth2 (Instant OTP)',
    slug: 'hotmail_fresh_oauth2',
    category: 'mail',
    price: 2.0,
    description: 'Added: 13 Nov | OAuth2 Enabled | Instant Inbox OTP',
    full_description:
      '• 100% Fresh Outlook/Hotmail accounts with OAuth2 Refresh Token + Client ID.\n• Use our built-in "Get OTP" tab or Bot API to read verification codes instantly.\n• Format: email|password|refresh_token|client_id',
    status: 'active',
    stockLines: Array.from({ length: 48 }, (_, i) => `user_hot_${100 + i}@hotmail.com|Pass#${1000 + i}|M.C510_BAY.2.U.token_${i}|9e5f94bc-e8a4-4e73-b8be-63364c29d753`),
  },
  {
    id: 2,
    name: 'Outlook Trusted Aged (2023–2024)',
    slug: 'outlook_trusted_aged',
    category: 'mail',
    price: 4.5,
    description: 'Aged Accounts | High Trust Score | OAuth2 + IMAP',
    full_description:
      '• Aged Outlook accounts registered in 2023-2024.\n• Ideal for Social Media, Discord, Steam & Business verifications.\n• Format: email|password|refresh_token|client_id',
    status: 'active',
    stockLines: Array.from({ length: 25 }, (_, i) => `aged_out_${200 + i}@outlook.com|Secure#${2000 + i}|M.C510_BAY.2.U.aged_${i}|9e5f94bc-e8a4-4e73-b8be-63364c29d753`),
  },
  {
    id: 3,
    name: 'USA Verified Gmail (App Password)',
    slug: 'usa_verified_gmail',
    category: 'gmail',
    price: 15.0,
    description: 'USA IP Created | Recovery Mail Included | 2FA Ready',
    full_description:
      '• Created with clean USA residential IP.\n• Includes Recovery Email & App Password for IMAP access.\n• Format: email|password|recovery_email',
    status: 'active',
    stockLines: Array.from({ length: 19 }, (_, i) => `us.member.${300 + i}@gmail.com|GmPass#${300 + i}|recovery_${i}@outlook.com`),
  },
  {
    id: 4,
    name: 'BD / USA Residential SOCKS5 Proxy',
    slug: 'socks5_residential_proxy',
    category: 'proxy',
    price: 25.0,
    description: 'Clean ISP | High Speed | 30 Days Validity',
    full_description:
      '• Dedicated high-speed SOCKS5 & HTTP Residential Proxy.\n• Compatible with AdsPower, Dolphin Anty, GoLogin & Shadowrocket.\n• Format: ip:port:username:password',
    status: 'active',
    stockLines: Array.from({ length: 14 }, (_, i) => `198.51.100.${10 + i}:1080:mrms_user_${i}:proxy_pass_${i}`),
  },
  {
    id: 5,
    name: 'Facebook High-Trust Profile + Cookie',
    slug: 'fb_profile_cookie',
    category: 'cookie',
    price: 35.0,
    description: '2FA Included | JSON Cookie + Token | Marketplace Ready',
    full_description:
      '• Always import JSON Cookie first before logging in.\n• Includes UID, Password, 2FA Secret Key, and Hotmail access.\n• Format: uid|password|2fa_secret|cookie_json',
    status: 'active',
    stockLines: Array.from({ length: 12 }, (_, i) => `10008945231${i}|FbPass#${i}|JBSWY3DPEHPK3PXP|[{\"name\":\"c_user\",\"value\":\"10008945231${i}\"}]`),
  },
];

const DEFAULT_SETTINGS: StoreSettings = {
  site_name: 'MRMS Mart',
  site_url: 'https://mrmsmart.bdz1.top',
  currency: '৳',
  bkash_status: '1',
  bkash_number: '017XXXXXXXX (Personal)',
  nagad_status: '1',
  nagad_number: '018XXXXXXXX (Personal)',
  binance_status: '1',
  binance_id: '849201948 (Binance Pay)',
  binance_rate: '120',
  binance_api_key: '',
  binance_api_secret: '',
  sms_sync_secret: 'mrms_sms_998877',
  min_deposit: '50',
  support_link: 'https://t.me/yourusername',
  site_notice: '⚡ Welcome to MRMS Mart! Instant 24/7 Automated Digital Delivery.',
  google_client_id: '606638148564-at6p4i35b1gk7ntvlrd25cc05mrq9b3d.apps.googleusercontent.com',
};

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 1,
    name: 'Mubasshir Ahmed',
    email: 'mubasshir@example.com',
    balance: 1250.0,
    api_key: 'mrms_9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c',
    api_status: 'approved',
    status: 'active',
    created_at: '2026-11-13 10:15:00',
  },
  {
    id: 2,
    name: 'Reseller Bot BD',
    email: 'reseller@bdmart.top',
    balance: 540.0,
    api_key: null,
    api_status: 'pending',
    status: 'active',
    created_at: '2026-11-13 12:30:00',
  },
];

const DEFAULT_ORDERS: OrderItem[] = [
  {
    id: 1,
    order_code: 'ORD-8F92A1B3',
    user_id: 1,
    user_email: 'mubasshir@example.com',
    product_id: 1,
    product_name: 'Hotmail Fresh OAuth2 (Instant OTP)',
    qty: 2,
    unit_price: 2.0,
    total_price: 4.0,
    items: [
      'demo_hot_1@hotmail.com|Pass1234|M.C510_BAY.2.U.demo_token_1|9e5f94bc-e8a4-4e73-b8be-63364c29d753',
      'demo_hot_2@hotmail.com|Pass5678|M.C510_BAY.2.U.demo_token_2|9e5f94bc-e8a4-4e73-b8be-63364c29d753',
    ],
    buy_source: 'web',
    created_at: '2026-11-13 14:20:10',
  },
];

const DEFAULT_DEPOSITS: DepositItem[] = [
  {
    id: 1,
    user_id: 1,
    user_name: 'Mubasshir Ahmed',
    user_email: 'mubasshir@example.com',
    method: 'bKash',
    sender_num: '01712345678',
    trx_id: 'BK98234X1A',
    amount: 500,
    status: 'approved',
    created_at: '2026-11-13 11:00:00',
  },
  {
    id: 2,
    user_id: 2,
    user_name: 'Reseller Bot BD',
    user_email: 'reseller@bdmart.top',
    method: 'Nagad',
    sender_num: '01898765432',
    trx_id: 'NG74129P0Q',
    amount: 300,
    screenshot:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220"><rect width="360" height="220" rx="14" fill="#fff7ed"/><rect x="14" y="14" width="332" height="44" rx="8" fill="#f7941d"/><text x="180" y="42" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="#fff" text-anchor="middle">Nagad Send Money Successful</text><text x="28" y="88" font-family="monospace" font-size="13" fill="#334155">Sender: 01898765432</text><text x="28" y="116" font-family="monospace" font-size="14" font-weight="bold" fill="#0f172a">Amount: BDT 300.00</text><text x="28" y="144" font-family="monospace" font-size="14" font-weight="bold" fill="#c2410c">TrxID: NG74129P0Q</text><text x="28" y="176" font-family="Arial,sans-serif" font-size="11" fill="#64748b">Status: Verified Payment Proof</text></svg>`
      ),
    status: 'pending',
    created_at: '2026-11-13 16:45:00',
  },
];

function makeSlug(name: string): string {
  const s = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return s || 'item_' + Math.floor(1000 + Math.random() * 9000);
}

function getUtf8ByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

export default function App() {
  // Top Studio Mode: 'store' (index.php) | 'admin' (admin.php) | 'editor' (editor.php) | 'app' (MRMS_AutoPay.apk) | 'code' (6 PHP files exporter)
  const [studioMode, setStudioMode] = useState<'store' | 'admin' | 'editor' | 'app' | 'code'>('app');

  // Shared Database State
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);
  const [currentUserId, setCurrentUserId] = useState<number | null>(1);
  const [orders, setOrders] = useState<OrderItem[]>(DEFAULT_ORDERS);
  const [deposits, setDeposits] = useState<DepositItem[]>(DEFAULT_DEPOSITS);

  // Parsed 6 PHP Files from /php_source/
  const [phpFiles, setPhpFiles] = useState<Record<string, string>>({
    'config.php': 'Loading config.php...',
    'db.php': 'Loading db.php...',
    'api.php': 'Loading api.php...',
    'index.php': 'Loading index.php...',
    'admin.php': 'Loading admin.php...',
    'editor.php': 'Loading editor.php...',
  });
  const [phpBackups, setPhpBackups] = useState<Record<string, string>>({});

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<{ text: string; isErr: boolean } | null>(null);
  const showToast = (text: string, isErr = false) => {
    setToastMsg({ text, isErr });
    setTimeout(() => {
      setToastMsg((prev) => (prev?.text === text ? null : prev));
    }, 3200);
  };

  // Load exact 6 PHP files from /php_source/ (saved byte-for-byte in workspace)
  useEffect(() => {
    const fileNames = ['config.php', 'db.php', 'api.php', 'index.php', 'admin.php', 'editor.php'];
    Promise.all(
      fileNames.map((fn) =>
        fetch(`/php_source/${fn}`)
          .then((r) => (r.ok ? r.text() : Promise.reject()))
          .then((txt) => [fn, txt] as const)
      )
    )
      .then((entries) => {
        const loaded: Record<string, string> = {};
        for (const [fn, txt] of entries) {
          loaded[fn] = txt;
        }
        setPhpFiles(loaded);
      })
      .catch(() => {
        fetch('/assets/aistudio/MRMS_Mart_All_Files_2026-11-13_19-21_4893cd15.txt')
          .then((r) => r.text())
          .then((raw) => {
            const parsed: Record<string, string> = {};
            const regex = /--- START OF FILE (\S+) ---\r?\n\r?\n([\s\S]*?)(?=(?:--- START OF FILE \S+ ---|$))/g;
            let match;
            while ((match = regex.exec(raw)) !== null) {
              parsed[match[1].trim()] = match[2].trim();
            }
            if (Object.keys(parsed).length > 0) {
              setPhpFiles(parsed);
            }
          })
          .catch(() => {});
      });
  }, []);

  const currentUser = useMemo(
    () => (currentUserId ? users.find((u) => u.id === currentUserId) || null : null),
    [users, currentUserId]
  );

  // ============================================================
  //  CUSTOMER STOREFRONT STATE (index.php)
  // ============================================================
  const [storePage, setStorePage] = useState<'shop' | 'otp' | 'orders' | 'deposit' | 'profile' | 'api-doc'>('shop');
  const [storeDrawerOpen, setStoreDrawerOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string>('all');

  // Buy Modal
  const [buyModalProd, setBuyModalProd] = useState<Product | null>(null);
  const [buyQty, setBuyQty] = useState<number>(1);

  // Delivered Order Modal
  const [deliveryModal, setDeliveryModal] = useState<{ code: string; items: string[] } | null>(null);

  // Auth Modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');

  // OTP Reader State
  const [otpInput, setOtpInput] = useState(
    'user_hot_101@hotmail.com|Pass#1001|M.C510_BAY.2.U.token_1|9e5f94bc-e8a4-4e73-b8be-63364c29d753'
  );
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpResult, setOtpResult] = useState<{
    email: string;
    latest_otp: string;
    messages: { subject: string; from: string; date: string; preview: string }[];
  } | null>(null);

  // Deposit Form
  const [depMethod, setDepMethod] = useState('bKash');
  const [depSender, setDepSender] = useState('');
  const [depAmount, setDepAmount] = useState('');
  const [depUsdt, setDepUsdt] = useState('');
  const [depTrx, setDepTrx] = useState('');
  const [depScreenshot, setDepScreenshot] = useState<string>('');
  const [screenPreviewDep, setScreenPreviewDep] = useState<DepositItem | null>(null);

  // Profile Form
  const [profName, setProfName] = useState(currentUser?.name || '');
  const [profEmail, setProfEmail] = useState(currentUser?.email || '');
  useEffect(() => {
    if (currentUser) {
      setProfName(currentUser.name);
      setProfEmail(currentUser.email);
    }
  }, [currentUser]);

  // ============================================================
  //  ADMIN PANEL STATE (admin.php)
  // ============================================================
  const [adminSec, setAdminSec] = useState<
    'dashboard' | 'categories' | 'products' | 'upload' | 'deposits' | 'users' | 'orders' | 'settings'
  >('dashboard');
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);

  // Admin Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('ri-mail-line');
  const [newCatSort, setNewCatSort] = useState('1');

  // Admin Product Form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('mail');
  const [newProdPrice, setNewProdPrice] = useState('2.00');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdFullDesc, setNewProdFullDesc] = useState('');
  const [editProdModal, setEditProdModal] = useState<Product | null>(null);

  // Admin Stock Upload Form
  const [upProdId, setUpProdId] = useState<string>('1');
  const [upText, setUpText] = useState('');

  // Admin User Search & Balance Modal
  const [userSearch, setUserSearch] = useState('');
  const [balModalUser, setBalModalUser] = useState<UserAccount | null>(null);
  const [balAdjustAmount, setBalAdjustAmount] = useState('');

  // Admin Code Patcher & File Editor
  const [selectedPhpFile, setSelectedPhpFile] = useState<string>('index.php');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [patchMatchInfo, setPatchMatchInfo] = useState<{ line: number; count: number } | null>(null);

  // Android App (MRMS_AutoPay.apk v2.1 Duotone + Animated Vector) Interactive Preview State
  const [iconPreset, setIconPreset] = useState<IconStylePreset>('fintech_solid');
  const [storeCleanStyle, setStoreCleanStyle] = useState<boolean>(true);
  const [appServiceOn, setAppServiceOn] = useState<boolean>(true);
  const [appNeverSleep, setAppNeverSleep] = useState<boolean>(true);
  const [appCustomOpen, setAppCustomOpen] = useState<boolean>(false);
  const [appSyncSpinCount, setAppSyncSpinCount] = useState<number>(0);
  const [appSyncUrl, setAppSyncUrl] = useState<string>('https://mrmsmart.bdz1.top/api.php?action=own_sms_sync');
  const [appSyncSecret, setAppSyncSecret] = useState<string>('mrms_sms_998877');
  const [appLogs, setAppLogs] = useState<string[]>(() => [
    '[15:21:08] [OK] Synced 2 SMS (New: 1, Approved: 1 - TrxID: NG74129P0Q)',
    '[15:20:50] [ACTIVE] Service STARTED (24/7 Auto-Sync Active).',
    '[15:20:45] [OK] Auto-Connected to mrmsmart.bdz1.top (Zero setup required).',
  ]);

  // Computed Totals
  const activeCategories = useMemo(
    () => categories.filter((c) => c.status === 'active').sort((a, b) => a.sort_order - b.sort_order),
    [categories]
  );
  const activeProducts = useMemo(() => products.filter((p) => p.status === 'active'), [products]);
  const totalAvailableStock = useMemo(
    () => activeProducts.reduce((sum, p) => sum + p.stockLines.length, 0),
    [activeProducts]
  );

  // ============================================================
  //  HANDLERS: CUSTOMER STOREFRONT
  // ============================================================
  const handleOpenBuyPopup = (prod: Product) => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    if (prod.stockLines.length === 0) {
      showToast('Product is out of stock!', true);
      return;
    }
    setBuyModalProd(prod);
    setBuyQty(1);
  };

  const handleConfirmPurchase = () => {
    if (!buyModalProd || !currentUser) return;
    const qty = Math.max(1, Math.min(buyQty, buyModalProd.stockLines.length));
    const total = Number((qty * buyModalProd.price).toFixed(2));

    if (currentUser.balance < total) {
      showToast(
        `Insufficient balance! Needed: ${settings.currency}${total.toFixed(2)}, Balance: ${settings.currency}${currentUser.balance.toFixed(2)}`,
        true
      );
      return;
    }

    const deliveredItems = buyModalProd.stockLines.slice(0, qty);
    const remainingStock = buyModalProd.stockLines.slice(qty);
    const orderCode = 'ORD-' + Math.random().toString(16).substring(2, 10).toUpperCase();

    // Update stock
    setProducts((prev) =>
      prev.map((p) => (p.id === buyModalProd.id ? { ...p, stockLines: remainingStock } : p))
    );

    // Deduct user balance
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, balance: Number((u.balance - total).toFixed(2)) } : u
      )
    );

    // Record Order
    const newOrder: OrderItem = {
      id: orders.length + 1,
      order_code: orderCode,
      user_id: currentUser.id,
      user_email: currentUser.email,
      product_id: buyModalProd.id,
      product_name: buyModalProd.name,
      qty,
      unit_price: buyModalProd.price,
      total_price: total,
      items: deliveredItems,
      buy_source: 'web',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setOrders((prev) => [newOrder, ...prev]);

    setBuyModalProd(null);
    showToast(`Purchased ${qty}x ${buyModalProd.name}!`);
    setDeliveryModal({ code: orderCode, items: deliveredItems });
  };

  const handleDownloadOrderFile = (code: string, items: string[], format: 'txt' | 'csv') => {
    let content = '';
    let mime = 'text/plain;charset=utf-8';
    if (format === 'csv') {
      mime = 'text/csv;charset=utf-8';
      content = '#,Account\n' + items.map((item, idx) => `${idx + 1},"${item.replace(/"/g, '""')}"`).join('\n');
    } else {
      content = items.join('\n');
    }
    const blob = new Blob([content], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${code}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`Downloaded ${code}.${format.toUpperCase()}!`);
  };

  const handleCheckMailOtp = () => {
    const raw = otpInput.trim();
    if (!raw) {
      showToast('Paste account line first!', true);
      return;
    }
    const parts = raw.split(/[|:;\t]+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2 || !parts[0].includes('@')) {
      showToast('Invalid format! Expected: email|password|refresh_token|client_id', true);
      return;
    }
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      const randomOtp = String(Math.floor(100000 + Math.random() * 900000));
      setOtpResult({
        email: parts[0],
        latest_otp: randomOtp,
        messages: [
          {
            subject: `${randomOtp} is your verification security code`,
            from: 'security@accountprotection.microsoft.com',
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            preview: `Use verification code ${randomOtp} for your authentication request. Never share this code with anyone.`,
          },
          {
            subject: 'Welcome to your new Outlook Inbox',
            from: 'no-reply@microsoft.com',
            date: '2026-11-13 09:15:00',
            preview: 'Your OAuth2 & IMAP mail access is active and ready for instant verification.',
          },
        ],
      });
      showToast('OTP Extracted Successfully!');
    }, 450);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image screenshot!', true);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        const maxDim = 650;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round(h * (maxDim / w));
            w = maxDim;
          } else {
            w = Math.round(w * (maxDim / h));
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          setDepScreenshot(canvas.toDataURL('image/jpeg', 0.72));
        }
      };
      img.src = String(ev.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitDeposit = () => {
    if (!currentUser) return;
    const amt = parseFloat(depAmount);
    const minDep = parseFloat(settings.min_deposit || '50');
    if (!depSender.trim()) {
      showToast('Please enter Sender Number / Binance ID!', true);
      return;
    }
    if (isNaN(amt) || amt < minDep) {
      showToast(`Minimum deposit is ${settings.currency}${minDep}`, true);
      return;
    }
    if (depTrx.trim().length < 4) {
      showToast('Enter a valid TrxID / Order ID!', true);
      return;
    }
    if (!depScreenshot) {
      showToast('Please upload your Payment Screenshot!', true);
      return;
    }
    const newDep: DepositItem = {
      id: deposits.length + 1,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_email: currentUser.email,
      method: depMethod,
      sender_num: depSender.trim(),
      trx_id: depTrx.trim().toUpperCase(),
      amount: amt,
      screenshot: depScreenshot,
      status: 'pending',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setDeposits((prev) => [newDep, ...prev]);
    setDepAmount('');
    setDepUsdt('');
    setDepTrx('');
    setDepScreenshot('');
    showToast('Payment submitted! Status: Pending (Wait few minutes for approval).');
  };

  const handleSimulateBackgroundAutoMatch = () => {
    const pendingList = deposits.filter((d) => d.status === 'pending');
    if (pendingList.length === 0) {
      showToast('No pending deposits to auto-match right now.');
      return;
    }
    setDeposits((prev) =>
      prev.map((d) => (d.status === 'pending' ? { ...d, status: 'approved' } : d))
    );
    setUsers((prev) =>
      prev.map((u) => {
        const added = pendingList
          .filter((d) => d.user_id === u.id)
          .reduce((sum, d) => sum + d.amount, 0);
        return added > 0 ? { ...u, balance: Number((u.balance + added).toFixed(2)) } : u;
      })
    );
    showToast(`⚡ Background Auto-Matcher approved ${pendingList.length} pending deposit(s)!`);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = authEmail.trim().toLowerCase();
    if (!email) return;

    if (authMode === 'login') {
      const found = users.find((u) => u.email.toLowerCase() === email);
      if (found) {
        setCurrentUserId(found.id);
        setAuthModalOpen(false);
        showToast(`Welcome back, ${found.name}!`);
      } else {
        // Auto sign-in or create demo account for convenience
        const created: UserAccount = {
          id: users.length + 1,
          name: email.split('@')[0],
          email,
          balance: 500,
          api_key: null,
          api_status: 'none',
          status: 'active',
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        setUsers((prev) => [...prev, created]);
        setCurrentUserId(created.id);
        setAuthModalOpen(false);
        showToast('Signed in successfully!');
      }
    } else {
      const created: UserAccount = {
        id: users.length + 1,
        name: authName.trim() || email.split('@')[0],
        email,
        balance: 100,
        api_key: null,
        api_status: 'none',
        status: 'active',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setUsers((prev) => [...prev, created]);
      setCurrentUserId(created.id);
      setAuthModalOpen(false);
      showToast('Account created successfully!');
    }
  };

  // ============================================================
  //  HANDLERS: ADMIN PANEL & CODE EXPORTER
  // ============================================================
  const handleDownloadSinglePhp = (filename: string) => {
    const content = phpFiles[filename] || '';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`Downloaded ${filename}!`);
  };

  const handleDownloadAllTxtBundle = () => {
    const order = ['config.php', 'db.php', 'api.php', 'index.php', 'admin.php', 'editor.php'];
    const bundle = order
      .map((fn) => `--- START OF FILE ${fn} ---\n\n${phpFiles[fn] || ''}\n\n`)
      .join('');
    const blob = new Blob([bundle], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `MRMS_Mart_All_Files_Updated.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Downloaded all 6 PHP files in 1 .TXT bundle!');
  };

  const handleSmartFindOrReplace = () => {
    const content = (phpFiles[selectedPhpFile] || '').replace(/\r\n/g, '\n');
    const target = findText.replace(/\r\n/g, '\n');
    if (!target.trim()) {
      showToast('Paste the code lines to find first!', true);
      return;
    }

    if (!patchMatchInfo) {
      const idx = content.indexOf(target);
      if (idx === -1) {
        showToast(`Exact snippet not found in ${selectedPhpFile}!`, true);
        return;
      }
      const line = content.substring(0, idx).split('\n').length;
      const count = content.split(target).length - 1;
      setPatchMatchInfo({ line, count });
      showToast(`Found ${count} match(es) starting at Line ${line}! Click green button to Replace.`);
    } else {
      const replacement = replaceText.replace(/\r\n/g, '\n');
      setPhpBackups((prev) => ({ ...prev, [selectedPhpFile]: content }));
      const updated = content.split(target).join(replacement);
      setPhpFiles((prev) => ({ ...prev, [selectedPhpFile]: updated }));
      setPatchMatchInfo(null);
      setFindText('');
      setReplaceText('');
      showToast(`Replaced & saved in ${selectedPhpFile}!`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: 78 }}>
      {/* ── STUDIO PREVIEW SWITCHER BAR (SWITCH BETWEEN CUSTOMER STORE, ADMIN PANEL & PHP FILES) ── */}
      <div
        style={{
          background: '#0f172a',
          color: '#f8fafc',
          padding: '7px 12px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
          zIndex: 250,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              background: 'linear-gradient(135deg,#38bdf8,#2563eb)',
              color: '#fff',
              fontSize: 10.5,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <i className="ri-flashlight-fill"></i> LIVE STUDIO
          </span>
          <span style={{ fontSize: 11.5, color: '#cbd5e1', fontWeight: 600 }}>
            MRMS Mart v6.2 — Customer Store, Admin Pro & PHP Source Sync
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setStudioMode('store')}
            className={`mrms-btn ${studioMode === 'store' ? 'mrms-btn-primary' : 'mrms-btn-ghost'}`}
            style={studioMode !== 'store' ? { background: '#1e293b', color: '#cbd5e1', borderColor: '#334155' } : {}}
          >
            <i className="ri-store-2-line"></i> Customer Store (index.php)
          </button>
          <button
            onClick={() => setStudioMode('admin')}
            className={`mrms-btn ${studioMode === 'admin' ? 'mrms-btn-primary' : 'mrms-btn-ghost'}`}
            style={studioMode !== 'admin' ? { background: '#1e293b', color: '#cbd5e1', borderColor: '#334155' } : {}}
          >
            <i className="ri-shield-keyhole-line"></i> Admin Panel (admin.php)
            {deposits.filter((d) => d.status === 'pending').length > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: 9.5,
                  padding: '1px 5px',
                  borderRadius: 99,
                  marginLeft: 2,
                }}
              >
                {deposits.filter((d) => d.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setStudioMode('editor')}
            className={`mrms-btn ${studioMode === 'editor' ? 'mrms-btn-primary' : 'mrms-btn-ghost'}`}
            style={studioMode !== 'editor' ? { background: '#1e293b', color: '#cbd5e1', borderColor: '#334155' } : {}}
          >
            <i className="ri-code-s-slash-line"></i> Code Editor (editor.php)
          </button>
          <button
            onClick={() => setStudioMode('app')}
            className={`mrms-btn ${studioMode === 'app' ? 'mrms-btn-primary' : 'mrms-btn-ghost'}`}
            style={studioMode !== 'app' ? { background: '#1e293b', color: '#cbd5e1', borderColor: '#334155' } : {}}
          >
            <i className="ri-smartphone-line"></i> Android App Preview (v2.1 Color)
          </button>
          <button
            onClick={() => setStudioMode('code')}
            className={`mrms-btn ${studioMode === 'code' ? 'mrms-btn-primary' : 'mrms-btn-ghost'}`}
            style={studioMode !== 'code' ? { background: '#1e293b', color: '#cbd5e1', borderColor: '#334155' } : {}}
          >
            <i className="ri-file-code-line"></i> PHP Source Files (6)
          </button>
          <a
            href="/MRMS_AutoPay.apk"
            download="MRMS_AutoPay.apk"
            className="mrms-btn mrms-btn-success"
            style={{ textDecoration: 'none' }}
          >
            <i className="ri-android-fill"></i> Download Android App (.APK)
          </a>
        </div>
      </div>

      {/* =====================================================================
          MODE 1: CUSTOMER STOREFRONT (EXACT index.php LIVE PREVIEW)
         ===================================================================== */}
      {studioMode === 'store' && (
        <div className={storeCleanStyle ? 'store-fintech-solid' : ''}>
          {/* Right Slide Drawer */}
          {storeDrawerOpen && (
            <div
              onClick={() => setStoreDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15,23,42,0.42)',
                backdropFilter: 'blur(4px)',
                zIndex: 200,
              }}
            />
          )}
          <aside
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 265,
              background: '#fff',
              zIndex: 210,
              transform: storeDrawerOpen ? 'translateX(0)' : 'translateX(102%)',
              transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid #E2E8F0',
              boxShadow: '-10px 0 35px rgba(15,23,42,0.12)',
            }}
          >
            <div
              style={{
                padding: 14,
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: storeCleanStyle ? '#FFFFFF' : 'linear-gradient(135deg,var(--primary-light),#ffffff)',
              }}
            >
              <div
                onClick={() => {
                  setStorePage('shop');
                  setStoreDrawerOpen(false);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: storeCleanStyle ? '#EFF6FF' : 'linear-gradient(145deg,#38bdf8 0%,#2563eb 60%,#1d4ed8 100%)',
                    border: storeCleanStyle ? '1px solid #BFDBFE' : 'none',
                    color: storeCleanStyle ? '#2563EB' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}
                >
                  {storeCleanStyle ? (
                    <DuotoneIcon name="flash" size={19} active stylePreset="fintech_solid" />
                  ) : (
                    <i className="ri-flashlight-fill"></i>
                  )}
                </div>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>{settings.site_name}</span>
              </div>
              <button className="mrms-btn mrms-btn-ghost" onClick={() => setStoreDrawerOpen(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div style={{ padding: 10, flex: 1, overflowY: 'auto' }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#64748B',
                  padding: '8px 10px 4px',
                }}
              >
                Account & Developer
              </div>
              {[
                {
                  id: 'profile',
                  icon: 'ri-user-settings-fill',
                  label: 'My Profile & API Key',
                  auth: true,
                  color: '#4F46E5',
                  bg: '#EEF2FF',
                  border: '#C7D2FE',
                },
                {
                  id: 'api-doc',
                  icon: 'ri-code-box-fill',
                  label: 'API Documentation',
                  auth: false,
                  color: '#0D9488',
                  bg: '#F0FDFA',
                  border: '#99F6E4',
                },
              ].map((item) => {
                const isAct = storePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setStoreDrawerOpen(false);
                      if (item.auth && !currentUser) {
                        setAuthModalOpen(true);
                        return;
                      }
                      setStorePage(item.id as any);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: storeCleanStyle
                        ? isAct
                          ? `1px solid ${item.color}`
                          : '1px solid transparent'
                        : 'none',
                      background: storeCleanStyle
                        ? isAct
                          ? item.bg
                          : 'transparent'
                        : isAct
                        ? 'linear-gradient(180deg,#38bdf8 0%,#2563eb 25%,#1d4ed8 100%)'
                        : 'transparent',
                      color: storeCleanStyle ? (isAct ? item.color : '#1E293B') : isAct ? '#fff' : 'var(--text)',
                      fontSize: 12.5,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      cursor: 'pointer',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: storeCleanStyle ? (isAct ? item.color : item.bg) : 'transparent',
                        border: storeCleanStyle ? `1px solid ${isAct ? item.color : item.border}` : 'none',
                        color: storeCleanStyle ? (isAct ? '#FFFFFF' : item.color) : 'inherit',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 15,
                      }}
                    >
                      <i className={item.icon}></i>
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#64748B',
                  padding: '12px 10px 4px',
                }}
              >
                Store Navigation
              </div>
              {[
                {
                  id: 'shop',
                  icon: 'ri-store-2-fill',
                  label: 'Buy Products (Shop)',
                  auth: false,
                  color: '#2563EB',
                  bg: '#EFF6FF',
                  border: '#BFDBFE',
                },
                {
                  id: 'otp',
                  icon: 'ri-mail-check-fill',
                  label: 'Get Mail Code (OTP)',
                  auth: false,
                  color: '#7C3AED',
                  bg: '#F5F3FF',
                  border: '#DDD6FE',
                },
                {
                  id: 'orders',
                  icon: 'ri-shopping-bag-3-fill',
                  label: 'My Orders History',
                  auth: true,
                  color: '#D97706',
                  bg: '#FFFBEB',
                  border: '#FDE68A',
                },
                {
                  id: 'deposit',
                  icon: 'ri-wallet-3-fill',
                  label: 'Add Balance (Deposit)',
                  auth: true,
                  color: '#059669',
                  bg: '#ECFDF5',
                  border: '#A7F3D0',
                },
              ].map((item) => {
                const isAct = storePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setStoreDrawerOpen(false);
                      if (item.auth && !currentUser) {
                        setAuthModalOpen(true);
                        return;
                      }
                      setStorePage(item.id as any);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: storeCleanStyle
                        ? isAct
                          ? `1px solid ${item.color}`
                          : '1px solid transparent'
                        : 'none',
                      background: storeCleanStyle
                        ? isAct
                          ? item.bg
                          : 'transparent'
                        : isAct
                        ? 'linear-gradient(180deg,#38bdf8 0%,#2563eb 25%,#1d4ed8 100%)'
                        : 'transparent',
                      color: storeCleanStyle ? (isAct ? item.color : '#1E293B') : isAct ? '#fff' : 'var(--text)',
                      fontSize: 12.5,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      cursor: 'pointer',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: storeCleanStyle ? (isAct ? item.color : item.bg) : 'transparent',
                        border: storeCleanStyle ? `1px solid ${isAct ? item.color : item.border}` : 'none',
                        color: storeCleanStyle ? (isAct ? '#FFFFFF' : item.color) : 'inherit',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 15,
                      }}
                    >
                      <i className={item.icon}></i>
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                padding: '10px 12px',
                borderTop: '1px solid #E2E8F0',
                background: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                <span style={{ fontWeight: 700, color: '#475569' }}>Need Help?</span>
                <a
                  href={settings.support_link}
                  target="_blank"
                  rel="noreferrer"
                  className="mrms-btn mrms-btn-outline"
                >
                  <i className="ri-customer-service-2-fill" style={{ color: '#2563EB' }}></i> Support
                </a>
              </div>
              {currentUser && (
                <button
                  className="mrms-btn mrms-btn-danger"
                  style={{ width: '100%', padding: 8 }}
                  onClick={() => {
                    setStoreDrawerOpen(false);
                    setCurrentUserId(null);
                    setStorePage('shop');
                    showToast('Logged out.');
                  }}
                >
                  <i className="ri-shut-down-line"></i> Sign Out / Logout
                </button>
              )}
            </div>
          </aside>

          {/* Sticky Top Navbar (Mobile View - Exact index.php) */}
          <header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
              height: 54,
              maxWidth: 480,
              width: '100%',
              margin: '0 auto',
              background: storeCleanStyle ? '#FFFFFF' : 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(16px)',
              borderBottom: storeCleanStyle ? '1px solid #E2E8F0' : '1px solid var(--border)',
              borderLeft: storeCleanStyle ? '1px solid #E2E8F0' : '1px solid var(--border)',
              borderRight: storeCleanStyle ? '1px solid #E2E8F0' : '1px solid var(--border)',
              boxShadow: storeCleanStyle ? '0 2px 8px rgba(15,23,42,0.03)' : '0 2px 12px rgba(37,99,235,0.05)',
            }}
          >
            <div
              style={{
                padding: '0 10px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div
                  onClick={() => setStorePage('shop')}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: storeCleanStyle
                        ? '#EFF6FF'
                        : 'linear-gradient(145deg,#38bdf8 0%,#2563eb 60%,#1d4ed8 100%)',
                      border: storeCleanStyle ? '1px solid #BFDBFE' : 'none',
                      color: storeCleanStyle ? '#2563EB' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                    }}
                  >
                    {storeCleanStyle ? (
                      <DuotoneIcon name="flash" size={20} active stylePreset="fintech_solid" />
                    ) : (
                      <i className="ri-flashlight-fill"></i>
                    )}
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>{settings.site_name}</span>
                </div>
              </div>

              {/* Right Auth / Wallet Pill + 3-Line Menu Icon (Mobile View) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {!currentUser ? (
                  <>
                    <button
                      className="mrms-btn mrms-btn-outline"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthModalOpen(true);
                      }}
                    >
                      <i className="ri-login-circle-fill" style={{ color: '#2563EB' }}></i> Sign In
                    </button>
                    <button
                      className="mrms-btn mrms-btn-primary"
                      onClick={() => {
                        setAuthMode('register');
                        setAuthModalOpen(true);
                      }}
                    >
                      <i className="ri-user-add-fill"></i> Join
                    </button>
                  </>
                ) : (
                  <div
                    onClick={() => setStorePage('deposit')}
                    style={{
                      background: storeCleanStyle
                        ? '#ECFDF5'
                        : 'linear-gradient(180deg,#eff6ff 0%,#dbeafe 100%)',
                      border: storeCleanStyle ? '1px solid #A7F3D0' : '1px solid #93c5fd',
                      color: storeCleanStyle ? '#065F46' : 'var(--primary-dark)',
                      padding: '5px 9px',
                      borderRadius: 9,
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <i
                      className="ri-wallet-3-fill"
                      style={{ color: storeCleanStyle ? '#059669' : 'var(--primary)', fontSize: 14 }}
                    ></i>
                    <span>
                      {settings.currency}
                      {currentUser.balance.toFixed(2)}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setStoreDrawerOpen(true)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: storeCleanStyle
                      ? '#F8FAFC'
                      : 'linear-gradient(180deg,#ffffff 0%,#edf5ff 100%)',
                    border: storeCleanStyle ? '1px solid #CBD5E1' : '1px solid #93c5fd',
                    color: storeCleanStyle ? '#0F172A' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                    cursor: 'pointer',
                    boxShadow: storeCleanStyle
                      ? 'none'
                      : 'inset 0 1px 0 #fff, 0 2px 6px rgba(37,99,235,0.12)',
                  }}
                  aria-label="Menu"
                >
                  <i className="ri-menu-3-fill"></i>
                </button>
              </div>
            </div>
          </header>

          {/* Main Store Container (Mobile View maxWidth: 480px) */}
          <main
            style={{
              maxWidth: 480,
              width: '100%',
              margin: '0 auto',
              padding: '12px 10px',
              flex: 1,
              background: storeCleanStyle ? '#F8FAFC' : 'rgba(238,245,255,0.45)',
              borderLeft: storeCleanStyle ? '1px solid #E2E8F0' : '1px solid var(--border)',
              borderRight: storeCleanStyle ? '1px solid #E2E8F0' : '1px solid var(--border)',
            }}
          >
            {settings.site_notice && (
              <div
                style={{
                  background: storeCleanStyle
                    ? '#EFF6FF'
                    : 'linear-gradient(90deg,#1d4ed8 0%,#2563eb 50%,#0284c7 100%)',
                  color: storeCleanStyle ? '#1E3A8A' : '#fff',
                  border: storeCleanStyle ? '1px solid #BFDBFE' : 'none',
                  padding: '8px 11px',
                  borderRadius: 11,
                  fontSize: 11.5,
                  fontWeight: 700,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: storeCleanStyle
                    ? 'none'
                    : 'inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 12px rgba(37,99,235,0.2)',
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: storeCleanStyle ? '#DBEAFE' : 'rgba(255,255,255,0.18)',
                    color: storeCleanStyle ? '#2563EB' : '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i className="ri-megaphone-fill"></i>
                </span>
                <span style={{ flex: 1 }}>{settings.site_notice}</span>
              </div>
            )}

            {/* 1. SHOP PAGE */}
            {storePage === 'shop' && (
              <section>
                <div
                  style={{
                    background: '#FFFFFF',
                    border: storeCleanStyle ? '1px solid #E2E8F0' : '1px solid var(--border)',
                    borderRadius: 14,
                    padding: '11px 13px',
                    marginBottom: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    flexWrap: 'wrap',
                    boxShadow: storeCleanStyle ? '0 2px 8px rgba(15,23,42,0.03)' : 'var(--shadow-float)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 7,
                          background: storeCleanStyle ? '#FEF3C7' : 'transparent',
                          border: storeCleanStyle ? '1px solid #FDE68A' : 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <i
                          className="ri-sparkling-fill"
                          style={{ color: storeCleanStyle ? '#D97706' : 'var(--primary)' }}
                        ></i>
                      </span>
                      <span>
                        Instant <span style={{ color: '#2563EB' }}>Digital Account Store</span>
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                      Tap any category below to filter. 100% automated instant delivery!
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div
                      style={{
                        background: storeCleanStyle
                          ? '#F5F3FF'
                          : 'linear-gradient(180deg,#ffffff 0%,#eff6ff 100%)',
                        border: storeCleanStyle ? '1px solid #DDD6FE' : '1px solid var(--primary-border)',
                        padding: '4px 9px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 800,
                        color: storeCleanStyle ? '#6D28D9' : 'var(--primary-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <i className="ri-box-3-fill" style={{ color: storeCleanStyle ? '#7C3AED' : 'inherit' }}></i>{' '}
                      {activeProducts.length} Items
                    </div>
                    <div
                      style={{
                        background: storeCleanStyle
                          ? '#ECFDF5'
                          : 'linear-gradient(180deg,#ffffff 0%,#eff6ff 100%)',
                        border: storeCleanStyle ? '1px solid #A7F3D0' : '1px solid var(--primary-border)',
                        padding: '4px 9px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 800,
                        color: storeCleanStyle ? '#047857' : 'var(--primary-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <i
                        className="ri-database-2-fill"
                        style={{ color: storeCleanStyle ? '#10B981' : 'inherit' }}
                      ></i>{' '}
                      {totalAvailableStock.toLocaleString()} Stock
                    </div>
                  </div>
                </div>

                {/* Category Filter Bar (Style 4: Clean Solid Multi-Color Pills) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    overflowX: 'auto',
                    padding: '2px 2px 8px',
                    marginBottom: 8,
                  }}
                >
                  <button
                    onClick={() => setActiveCat('all')}
                    style={{
                      padding: '6px 11px',
                      borderRadius: 9,
                      background: storeCleanStyle
                        ? activeCat === 'all'
                          ? '#2563EB'
                          : '#FFFFFF'
                        : activeCat === 'all'
                        ? 'linear-gradient(180deg,#38bdf8 0%,#2563eb 25%,#1d4ed8 100%)'
                        : 'linear-gradient(180deg,#ffffff 0%,#f5f9ff 100%)',
                      border: storeCleanStyle
                        ? activeCat === 'all'
                          ? '1px solid #1D4ED8'
                          : '1px solid #CBD5E1'
                        : activeCat === 'all'
                        ? '1px solid #1e40af'
                        : '1px solid var(--border)',
                      color: activeCat === 'all' ? '#FFFFFF' : '#1E293B',
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <i
                      className="ri-apps-2-fill"
                      style={{ color: activeCat === 'all' ? '#FFFFFF' : '#2563EB', fontSize: 13.5 }}
                    ></i>{' '}
                    All
                  </button>
                  {activeCategories.map((c, idx) => {
                    const isAct = activeCat === c.slug;
                    const palettes = [
                      { color: '#0284C7', bg: '#E0F2FE', border: '#BAE6FD' },
                      { color: '#E11D48', bg: '#FFE4E6', border: '#FECDD3' },
                      { color: '#7C3AED', bg: '#F3E8FF', border: '#DDD6FE' },
                      { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
                      { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
                    ];
                    const pal = palettes[idx % palettes.length];
                    const solidIcon = c.icon.startsWith('ri-')
                      ? c.icon.replace('-line', '-fill')
                      : 'ri-mail-star-fill';
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveCat(c.slug)}
                        style={{
                          padding: '6px 11px',
                          borderRadius: 9,
                          background: storeCleanStyle
                            ? isAct
                              ? pal.color
                              : '#FFFFFF'
                            : isAct
                            ? 'linear-gradient(180deg,#38bdf8 0%,#2563eb 25%,#1d4ed8 100%)'
                            : 'linear-gradient(180deg,#ffffff 0%,#f5f9ff 100%)',
                          border: storeCleanStyle
                            ? isAct
                              ? `1px solid ${pal.color}`
                              : '1px solid #CBD5E1'
                            : isAct
                            ? '1px solid #1e40af'
                            : '1px solid var(--border)',
                          color: isAct ? '#FFFFFF' : '#1E293B',
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <i
                          className={solidIcon}
                          style={{
                            color: isAct ? '#FFFFFF' : storeCleanStyle ? pal.color : 'var(--primary)',
                            fontSize: 13.5,
                          }}
                        ></i>{' '}
                        {c.name}
                      </button>
                    );
                  })}
                </div>

                {/* Product Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {activeProducts
                    .filter((p) => activeCat === 'all' || p.category === activeCat)
                    .map((p, idx) => {
                      const catIdx = Math.max(
                        0,
                        activeCategories.findIndex((c) => c.slug === p.category)
                      );
                      const catObj = categories.find((c) => c.slug === p.category);
                      const palettes = [
                        { color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' },
                        { color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3' },
                        { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
                        { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
                        { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
                      ];
                      const pal = palettes[(catIdx >= 0 ? catIdx : idx) % palettes.length];
                      const solidIcon = catObj?.icon.startsWith('ri-')
                        ? catObj.icon.replace('-line', '-fill')
                        : 'ri-mail-star-fill';
                      const stk = p.stockLines.length;
                      return (
                        <div
                          key={p.id}
                          style={{
                            background: '#FFFFFF',
                            border: storeCleanStyle ? '1px solid #E2E8F0' : '1px solid var(--border)',
                            borderRadius: 12,
                            padding: '10px 11px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 9,
                            boxShadow: storeCleanStyle
                              ? '0 2px 6px rgba(15,23,42,0.03)'
                              : '0 3px 10px rgba(37,99,235,0.05)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 9,
                                flexShrink: 0,
                                background: storeCleanStyle
                                  ? pal.bg
                                  : 'linear-gradient(145deg,#eff6ff 0%,#dbeafe 100%)',
                                border: storeCleanStyle
                                  ? `1px solid ${pal.border}`
                                  : '1px solid var(--primary-border)',
                                color: storeCleanStyle ? pal.color : 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 17,
                              }}
                            >
                              <i className={solidIcon}></i>
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A' }}>{p.name}</div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  flexWrap: 'wrap',
                                  marginTop: 3,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 800,
                                    padding: '1.5px 6px',
                                    borderRadius: 6,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    background:
                                      stk === 0
                                        ? 'var(--danger-bg)'
                                        : stk < 20
                                        ? 'var(--warning-bg)'
                                        : 'var(--success-bg)',
                                    color: stk === 0 ? 'var(--danger)' : stk < 20 ? '#d97706' : '#059669',
                                    border:
                                      stk === 0
                                        ? '1px solid #fecaca'
                                        : stk < 20
                                        ? '1px solid #fde68a'
                                        : '1px solid #a7f3d0',
                                  }}
                                >
                                  <i className="ri-checkbox-blank-circle-fill" style={{ fontSize: 6 }}></i>{' '}
                                  {stk === 0 ? 'Out of Stock' : `Stock: ${stk}`}
                                </span>
                                {p.description && (
                                  <span
                                    style={{
                                      fontSize: 10.5,
                                      color: '#64748B',
                                      maxWidth: 130,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {p.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                            <div style={{ textAlign: 'right', marginRight: 2 }}>
                              <span
                                className="mono"
                                style={{
                                  fontSize: 13.5,
                                  fontWeight: 800,
                                  color: storeCleanStyle ? '#0F172A' : 'var(--primary)',
                                  display: 'block',
                                  lineHeight: 1.1,
                                }}
                              >
                                {settings.currency}
                                {p.price.toFixed(2)}
                              </span>
                              <span style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 600 }}>per pc</span>
                            </div>
                            <button
                              className={`mrms-btn ${stk > 0 ? 'mrms-btn-primary' : 'mrms-btn-ghost'}`}
                              style={{ padding: '7px 13px' }}
                              disabled={stk === 0}
                              onClick={() => handleOpenBuyPopup(p)}
                            >
                              <i className={stk > 0 ? 'ri-shopping-cart-2-fill' : 'ri-forbid-line'}></i>{' '}
                              {stk > 0 ? 'Buy' : 'Sold'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {/* 2. GET MAIL OTP SECTION */}
            {storePage === 'otp' && (
              <section>
                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-mail-open-line"></i> Read Mail & Extract OTP Code
                    </h3>
                    <span className="mrms-badge mrms-b-blue">OAuth2 / IMAP</span>
                  </div>
                  <div className="mrms-card-body">
                    <p style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 9, lineHeight: 1.45 }}>
                      Paste your purchased mail line (
                      <code className="mono" style={{ color: 'var(--primary)' }}>
                        email|password|refresh_token|client_id
                      </code>
                      ) to get verification codes:
                    </p>
                    <div className="mrms-fg">
                      <input
                        type="text"
                        className="mono"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="user@hotmail.com|Pass123|M.C510_BAY...|9e5f94bc-e8a4..."
                      />
                    </div>
                    <button
                      className="mrms-btn mrms-btn-primary"
                      disabled={otpLoading}
                      onClick={handleCheckMailOtp}
                    >
                      <i className={otpLoading ? 'ri-loader-4-line spin-anim' : 'ri-search-eye-line'}></i>{' '}
                      {otpLoading ? 'Checking Inbox...' : 'Check Inbox & Get Code'}
                    </button>

                    {otpResult && (
                      <div style={{ marginTop: 12 }}>
                        <div
                          style={{
                            background: 'var(--primary-light)',
                            border: '2px dashed var(--primary)',
                            padding: 12,
                            borderRadius: 10,
                            textAlign: 'center',
                            marginBottom: 10,
                          }}
                        >
                          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)' }}>
                            LATEST OTP CODE ({otpResult.email})
                          </div>
                          <div
                            className="mono"
                            style={{
                              fontSize: 24,
                              fontWeight: 800,
                              color: 'var(--primary-dark)',
                              margin: '4px 0',
                            }}
                          >
                            {otpResult.latest_otp}
                          </div>
                          <button
                            className="mrms-btn mrms-btn-primary"
                            onClick={() => {
                              navigator.clipboard.writeText(otpResult.latest_otp);
                              showToast('OTP Copied!');
                            }}
                          >
                            <i className="ri-file-copy-line"></i> Copy Code
                          </button>
                        </div>

                        {otpResult.messages.map((m, i) => (
                          <div
                            key={i}
                            style={{
                              border: '1px solid var(--border)',
                              borderRadius: 8,
                              padding: 9,
                              marginBottom: 6,
                            }}
                          >
                            <div style={{ fontWeight: 800, fontSize: 12 }}>{m.subject}</div>
                            <div style={{ fontSize: 10, color: 'var(--primary)', margin: '2px 0' }}>
                              {m.from} • {m.date}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{m.preview}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* 3. MY ORDERS SECTION */}
            {storePage === 'orders' && (
              <section>
                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-shopping-bag-3-line"></i> My Purchased Orders
                    </h3>
                    <button
                      className="mrms-btn mrms-btn-outline"
                      onClick={() => showToast('Orders refreshed!')}
                    >
                      <i className="ri-refresh-line"></i> Refresh
                    </button>
                  </div>
                  <div className="mrms-tbl-wrap">
                    <table className="mrms-tbl">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Paid</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.filter((o) => !currentUser || o.user_id === currentUser.id).length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                              No orders yet.
                            </td>
                          </tr>
                        ) : (
                          orders
                            .filter((o) => !currentUser || o.user_id === currentUser.id)
                            .map((o) => (
                              <tr key={o.id}>
                                <td className="mono" style={{ fontWeight: 800, color: 'var(--primary)' }}>
                                  {o.order_code}
                                </td>
                                <td>
                                  <b>{o.product_name}</b>
                                </td>
                                <td>{o.qty}</td>
                                <td>
                                  <b>
                                    {settings.currency}
                                    {o.total_price.toFixed(2)}
                                  </b>
                                </td>
                                <td style={{ fontSize: 10.5, color: 'var(--muted)' }}>{o.created_at}</td>
                                <td>
                                  <button
                                    className="mrms-btn mrms-btn-outline"
                                    onClick={() => setDeliveryModal({ code: o.order_code, items: o.items })}
                                  >
                                    <i className="ri-eye-line"></i> View
                                  </button>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* 4. OWN AUTO-PAYMENT GATEWAY SECTION (Mobile View 1-Column) */}
            {storePage === 'deposit' && (
              <section className="grid grid-cols-1 gap-3">
                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-shield-flash-line"></i> MRMS Auto-Payment Gateway
                    </h3>
                    <span className="mrms-badge mrms-b-ok">
                      <i className="ri-flashlight-fill"></i> Auto-Verify
                    </span>
                  </div>
                  <div className="mrms-card-body">
                    {(() => {
                      const availableMethods = [
                        {
                          key: 'bKash',
                          label: 'bKash',
                          active: settings.bkash_status === '1',
                          num: settings.bkash_number,
                          color: '#e2136e',
                          grad: 'linear-gradient(135deg,#e2136e,#b80d57)',
                          icon: 'ri-smartphone-line',
                        },
                        {
                          key: 'Nagad',
                          label: 'Nagad',
                          active: settings.nagad_status === '1',
                          num: settings.nagad_number,
                          color: '#f7941d',
                          grad: 'linear-gradient(135deg,#f7941d,#d9531e)',
                          icon: 'ri-smartphone-line',
                        },
                        {
                          key: 'Binance',
                          label: 'Binance',
                          active: settings.binance_status === '1',
                          num: settings.binance_id,
                          color: '#d97706',
                          grad: 'linear-gradient(135deg,#1e2329,#3b424c)',
                          icon: 'ri-bit-coin-line',
                        },
                      ].filter((m) => m.active);

                      if (availableMethods.length === 0) {
                        return (
                          <div
                            style={{
                              padding: 12,
                              background: 'var(--danger-bg)',
                              color: 'var(--danger)',
                              borderRadius: 9,
                              fontSize: 12,
                              fontWeight: 700,
                              textAlign: 'center',
                            }}
                          >
                            <i className="ri-error-warning-line"></i> All payment methods are currently turned OFF by
                            Admin.
                          </div>
                        );
                      }

                      const currentSel =
                        availableMethods.find((m) => m.key === depMethod) || availableMethods[0];

                      return (
                        <>
                          {/* 1. Method Selector Tabs */}
                          <div className="mrms-fg" style={{ marginBottom: 10 }}>
                            <label>1. Choose Payment Method</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
                              {availableMethods.map((m) => {
                                const isSel = currentSel.key === m.key;
                                return (
                                  <button
                                    key={m.key}
                                    type="button"
                                    onClick={() => setDepMethod(m.key)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: 5,
                                      padding: '8px 6px',
                                      borderRadius: 9,
                                      fontSize: 11.5,
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      border: isSel ? `2px solid ${m.color}` : '1px solid var(--border)',
                                      background: isSel ? '#fff' : '#f8fafc',
                                      color: isSel ? m.color : 'var(--muted)',
                                      boxShadow: isSel ? '0 3px 10px rgba(0,0,0,0.06)' : 'none',
                                    }}
                                  >
                                    <i className={m.icon}></i> {m.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 2. Branded Payment Instruction Card */}
                          <div
                            style={{
                              borderRadius: 11,
                              padding: '11px 12px',
                              marginBottom: 11,
                              color: '#fff',
                              background: currentSel.grad,
                              boxShadow: '0 6px 16px rgba(15,23,42,0.16)',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 6,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  letterSpacing: 0.5,
                                  opacity: 0.92,
                                }}
                              >
                                {currentSel.key === 'Binance'
                                  ? 'Binance Pay (Auto-API Verify)'
                                  : `${currentSel.label} Personal (Send Money)`}
                              </span>
                              <span
                                style={{
                                  background: 'rgba(255,255,255,0.2)',
                                  padding: '2px 7px',
                                  borderRadius: 99,
                                  fontSize: 10,
                                  fontWeight: 800,
                                }}
                              >
                                Min: {settings.currency}
                                {settings.min_deposit}
                              </span>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'rgba(0,0,0,0.24)',
                                padding: '7px 10px',
                                borderRadius: 8,
                                marginBottom: 6,
                              }}
                            >
                              <div>
                                <div style={{ fontSize: 9.5, opacity: 0.8 }}>
                                  {currentSel.key === 'Binance'
                                    ? 'Binance Pay ID / UID'
                                    : `${currentSel.label} Personal Number`}
                                </div>
                                <div className="mono" style={{ fontSize: 14, fontWeight: 800 }}>
                                  {currentSel.num}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="mrms-btn"
                                style={{
                                  background: '#fff',
                                  color: '#0f172a',
                                  padding: '5px 9px',
                                  fontSize: 11,
                                  fontWeight: 800,
                                }}
                                onClick={() => {
                                  navigator.clipboard.writeText(currentSel.num);
                                  showToast('Payment ID / Number Copied!');
                                }}
                              >
                                <i className="ri-file-copy-line"></i> Copy
                              </button>
                            </div>

                            <div style={{ fontSize: 10.5, lineHeight: 1.45, opacity: 0.95 }}>
                              {currentSel.key === 'Binance'
                                ? `Send USDT via Binance Pay to the ID above (Rate: 1 USDT = ${settings.currency}${settings.binance_rate}). Enter your Binance Order ID / TrxID & Screenshot below.`
                                : `Send Money to the ${currentSel.label} number above. Then enter your Sender Number, Amount, TrxID & Payment Screenshot below.`}
                            </div>
                          </div>

                          {/* Optional Binance USDT Calculator */}
                          {currentSel.key === 'Binance' && (
                            <div
                              style={{
                                background: '#fefce8',
                                border: '1px solid #fde047',
                                borderRadius: 9,
                                padding: '8px 10px',
                                marginBottom: 10,
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontSize: 11,
                                  fontWeight: 800,
                                  color: '#854d0e',
                                  marginBottom: 5,
                                }}
                              >
                                <span>
                                  <i className="ri-coins-line"></i> Binance USDT Calculator
                                </span>
                                <span>
                                  Rate: 1 USDT = {settings.currency}
                                  {settings.binance_rate}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={depUsdt}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setDepUsdt(val);
                                    const num = parseFloat(val || '0');
                                    const rate = parseFloat(settings.binance_rate || '120');
                                    if (num > 0) {
                                      setDepAmount(String(Math.round(num * rate * 100) / 100));
                                    }
                                  }}
                                  placeholder="Enter USDT (e.g. 1)"
                                  style={{
                                    flex: 1,
                                    padding: '6px 9px',
                                    borderRadius: 7,
                                    border: '1px solid #facc15',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    background: '#fff',
                                  }}
                                />
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#854d0e' }}>=</span>
                                <span
                                  className="mono"
                                  style={{
                                    fontSize: 12.5,
                                    fontWeight: 800,
                                    color: '#ca8a04',
                                    minWidth: 70,
                                    textAlign: 'right',
                                  }}
                                >
                                  {settings.currency}
                                  {depAmount ? Number(depAmount).toFixed(2) : '0.00'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Form Fields */}
                          <div className="mrms-fg">
                            <label>
                              {currentSel.key === 'Binance'
                                ? 'Your Binance Name / Pay ID'
                                : `Sender ${currentSel.label} Number`}
                            </label>
                            <input
                              type="text"
                              value={depSender}
                              onChange={(e) => setDepSender(e.target.value)}
                              placeholder={
                                currentSel.key === 'Binance' ? 'e.g. Binance UID or Name' : '017XXXXXXXX'
                              }
                            />
                          </div>
                          <div className="mrms-fg">
                            <label>Amount Sent ({settings.currency})</label>
                            <input
                              type="number"
                              value={depAmount}
                              onChange={(e) => setDepAmount(e.target.value)}
                              placeholder="100"
                            />
                          </div>
                          <div className="mrms-fg">
                            <label>
                              {currentSel.key === 'Binance'
                                ? 'Binance Order ID / TrxID'
                                : `${currentSel.label} Transaction ID (TrxID)`}
                            </label>
                            <input
                              type="text"
                              value={depTrx}
                              onChange={(e) => setDepTrx(e.target.value)}
                              placeholder="e.g. BHG7654321"
                            />
                          </div>

                          {/* Payment Screenshot Upload */}
                          <div className="mrms-fg">
                            <label>
                              <i className="ri-image-add-line"></i> Payment Screenshot (Required)
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleScreenshotUpload}
                              style={{
                                padding: 6,
                                background: '#f8fafc',
                                border: '1.5px dashed var(--primary-border)',
                                cursor: 'pointer',
                                fontSize: 11.5,
                              }}
                            />
                            {depScreenshot && (
                              <div
                                style={{
                                  marginTop: 7,
                                  border: '1px solid var(--border)',
                                  borderRadius: 8,
                                  padding: 6,
                                  background: '#f8fafc',
                                  textAlign: 'center',
                                }}
                              >
                                <img
                                  src={depScreenshot}
                                  alt="Screenshot Preview"
                                  style={{
                                    maxHeight: 130,
                                    maxWidth: '100%',
                                    borderRadius: 6,
                                    objectFit: 'contain',
                                    margin: '0 auto',
                                  }}
                                />
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 4,
                                    fontSize: 10.5,
                                    color: 'var(--primary-dark)',
                                    fontWeight: 700,
                                  }}
                                >
                                  <span>
                                    <i className="ri-checkbox-circle-fill"></i> Screenshot Ready
                                  </span>
                                  <button
                                    type="button"
                                    className="mrms-btn mrms-btn-ghost"
                                    style={{ padding: '2px 7px', fontSize: 10, color: 'var(--danger)' }}
                                    onClick={() => setDepScreenshot('')}
                                  >
                                    <i className="ri-delete-bin-line"></i> Remove
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            className="mrms-btn mrms-btn-primary"
                            style={{ width: '100%', padding: 9 }}
                            onClick={handleSubmitDeposit}
                          >
                            <i className="ri-shield-check-line"></i> Submit Payment for Auto-Verification
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-history-line"></i> Deposit History
                    </h3>
                    <button
                      className="mrms-btn mrms-btn-outline"
                      onClick={handleSimulateBackgroundAutoMatch}
                      title="Simulate Phone SMS / Binance API Background Auto-Approve"
                    >
                      <i className="ri-flashlight-line"></i> Test Auto-Match
                    </button>
                  </div>
                  <div className="mrms-tbl-wrap">
                    <table className="mrms-tbl">
                      <thead>
                        <tr>
                          <th>Method</th>
                          <th>Amount</th>
                          <th>TrxID</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deposits
                          .filter((d) => !currentUser || d.user_id === currentUser.id)
                          .map((d) => (
                            <tr key={d.id}>
                              <td>
                                <b>{d.method}</b>
                              </td>
                              <td>
                                <b>
                                  {settings.currency}
                                  {d.amount.toFixed(2)}
                                </b>
                              </td>
                              <td className="mono">{d.trx_id}</td>
                              <td>
                                <span
                                  className={`mrms-badge ${
                                    d.status === 'approved'
                                      ? 'mrms-b-ok'
                                      : d.status === 'rejected'
                                      ? 'mrms-b-err'
                                      : 'mrms-b-warn'
                                  }`}
                                >
                                  {d.status === 'pending'
                                    ? 'PENDING (Wait few minutes for approval)'
                                    : d.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* 5. PROFILE & API KEY SECTION (Mobile View 1-Column) */}
            {storePage === 'profile' && currentUser && (
              <section>
                <div className="grid grid-cols-1 gap-3">
                  <div className="mrms-card">
                    <div className="mrms-card-head">
                      <h3>
                        <i className="ri-user-line"></i> Edit Profile
                      </h3>
                    </div>
                    <div className="mrms-card-body">
                      <div className="mrms-fg">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={profName}
                          onChange={(e) => setProfName(e.target.value)}
                        />
                      </div>
                      <div className="mrms-fg">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={profEmail}
                          onChange={(e) => setProfEmail(e.target.value)}
                        />
                      </div>
                      <button
                        className="mrms-btn mrms-btn-primary"
                        onClick={() => {
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === currentUser.id ? { ...u, name: profName, email: profEmail } : u
                            )
                          );
                          showToast('Profile updated!');
                        }}
                      >
                        <i className="ri-save-line"></i> Save Profile
                      </button>
                    </div>
                  </div>

                  <div className="mrms-card">
                    <div className="mrms-card-head">
                      <h3>
                        <i className="ri-lock-password-line"></i> Change Password
                      </h3>
                    </div>
                    <div className="mrms-card-body">
                      <div className="mrms-fg">
                        <label>Current Password</label>
                        <input type="password" placeholder="••••••••" />
                      </div>
                      <div className="mrms-fg">
                        <label>New Password</label>
                        <input type="password" placeholder="Minimum 4 characters" />
                      </div>
                      <button
                        className="mrms-btn mrms-btn-primary"
                        onClick={() => showToast('Password updated!')}
                      >
                        <i className="ri-key-line"></i> Update Password
                      </button>
                    </div>
                  </div>
                </div>

                  <div className="mrms-card">
                    <div className="mrms-card-head">
                      <h3>
                        <i className="ri-key-2-line"></i> Reseller API Key Access
                      </h3>
                      <span
                        className={`mrms-badge ${
                          currentUser.api_status === 'approved'
                            ? 'mrms-b-ok'
                            : currentUser.api_status === 'pending'
                            ? 'mrms-b-warn'
                            : 'mrms-b-blue'
                        }`}
                      >
                        {currentUser.api_status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mrms-card-body">
                      {currentUser.api_status === 'approved' ? (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            readOnly
                            className="mono"
                            value={currentUser.api_key || ''}
                            style={{
                              flex: 1,
                              padding: '7px 10px',
                              borderRadius: 8,
                              border: '1px solid var(--primary-border)',
                              background: 'var(--primary-light)',
                              fontWeight: 700,
                              color: 'var(--primary-dark)',
                              fontSize: 11.5,
                            }}
                          />
                          <button
                            className="mrms-btn mrms-btn-outline"
                            onClick={() => {
                              navigator.clipboard.writeText(currentUser.api_key || '');
                              showToast('API Key Copied!');
                            }}
                          >
                            <i className="ri-file-copy-line"></i> Copy
                          </button>
                          <button
                            className="mrms-btn mrms-btn-primary"
                            onClick={() => {
                              const newKey =
                                'mrms_' +
                                Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                              setUsers((prev) =>
                                prev.map((u) => (u.id === currentUser.id ? { ...u, api_key: newKey } : u))
                              );
                              showToast('New API Key generated!');
                            }}
                          >
                            <i className="ri-refresh-line"></i> New Key
                          </button>
                        </div>
                      ) : currentUser.api_status === 'pending' ? (
                        <div style={{ fontSize: 12, color: '#b45309' }}>
                          <i className="ri-time-line"></i> Your API Key request is pending Admin approval. (Switch to
                          Admin Panel at the top to approve!)
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 8 }}>
                            Request Reseller API Key access to connect your Telegram bot or external website.
                          </p>
                          <button
                            className="mrms-btn mrms-btn-primary"
                            onClick={() => {
                              setUsers((prev) =>
                                prev.map((u) => (u.id === currentUser.id ? { ...u, api_status: 'pending' } : u))
                              );
                              showToast('API Access requested! Approve it in Admin Panel.');
                            }}
                          >
                            <i className="ri-rocket-line"></i> Request API Access
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
              </section>
            )}

            {/* 6. API DOCUMENTATION SECTION */}
            {storePage === 'api-doc' && (
              <section>
                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-robot-2-line"></i> Telegram Bot & Reseller API Documentation
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span className="mrms-badge mrms-b-blue">
                        <i className="ri-speed-up-line"></i> 60 req/min
                      </span>
                      <button
                        className="mrms-btn mrms-btn-primary"
                        onClick={() => {
                          const key = currentUser?.api_key || 'YOUR_API_KEY';
                          const base = `${settings.site_url}/api.php/${key}`;
                          const docTxt = [
                            `===================================================================`,
                            `  ${settings.site_name} — OFFICIAL BOT & RESELLER API DOCUMENTATION`,
                            `  Base URL   : ${settings.site_url}/api.php`,
                            `  Your Key   : ${key}`,
                            `  Rate Limit : 60 Requests / Minute`,
                            `===================================================================`,
                            `Step 1 (Categories)   : ${base}/categories`,
                            `Step 2 (Cat Products) : ${base}/products/mail`,
                            `Step 3 (Buy Accounts) : ${base}/buy/hotmail/5`,
                            `Step 4 (Read Mail OTP): ${base}/code/EMAIL|PASS|REFRESH_TOKEN|CLIENT_ID`,
                            `Step 5 (Check Balance): ${base}/balance`,
                          ].join('\n');
                          const blob = new Blob([docTxt], { type: 'text/plain;charset=utf-8' });
                          const a = document.createElement('a');
                          a.href = URL.createObjectURL(blob);
                          a.download = 'MRMS_Mart_API_Docs.txt';
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          showToast('API Documentation (.TXT) downloaded!');
                        }}
                      >
                        <i className="ri-file-download-line"></i> Download Full Doc (.TXT)
                      </button>
                    </div>
                  </div>
                  <div className="mrms-card-body">
                    <div
                      style={{
                        background: 'linear-gradient(135deg,var(--primary-light),#ffffff)',
                        border: '1px solid var(--primary-border)',
                        borderRadius: 11,
                        padding: '11px 13px',
                        marginBottom: 14,
                        fontSize: 11.5,
                        lineHeight: 1.55,
                      }}
                    >
                      <div style={{ fontWeight: 800, color: 'var(--primary-dark)', marginBottom: 3 }}>
                        <i className="ri-information-line"></i> Clean Slash (<code className="mono">/</code>) API
                        Structure for Easy Bot Building:
                      </div>
                      Every API URL starts with your approved{' '}
                      <code className="mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        API_KEY
                      </code>{' '}
                      followed by <code className="mono">/</code> and the command.
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span>Your Active Key:</span>
                        <code
                          className="mono"
                          style={{
                            background: '#fff',
                            padding: '2px 8px',
                            borderRadius: 6,
                            border: '1px solid var(--primary-border)',
                            color: 'var(--primary-dark)',
                            fontWeight: 800,
                          }}
                        >
                          {currentUser?.api_key || 'YOUR_API_KEY'}
                        </code>
                        <button
                          className="mrms-btn mrms-btn-outline"
                          style={{ padding: '3px 8px', fontSize: 10 }}
                          onClick={() => {
                            if (!currentUser) {
                              setAuthModalOpen(true);
                              return;
                            }
                            setStorePage('profile');
                          }}
                        >
                          <i className="ri-key-2-line"></i> Get / Manage Key
                        </button>
                      </div>
                    </div>

                    {[
                      {
                        step: 'STEP 1 • GET',
                        title: '1. Load Categories (To Show Category Buttons in Bot)',
                        url: `${settings.site_url}/api.php/${currentUser?.api_key || 'YOUR_API_KEY'}/categories`,
                        json: `{\n  "success": true,\n  "categories": [\n    {\n      "id": 1,\n      "name": "Hotmail / Outlook",\n      "category_code": "mail",\n      "total_products": 3\n    }\n  ]\n}`,
                      },
                      {
                        step: 'STEP 2 • GET',
                        title: '2. Load Products & Live Stock Under a Category',
                        url: `${settings.site_url}/api.php/${currentUser?.api_key || 'YOUR_API_KEY'}/products/mail`,
                        json: `{\n  "success": true,\n  "category": "mail",\n  "currency": "${settings.currency}",\n  "products": [\n    {\n      "product_id": 1,\n      "name": "Hotmail Fresh OAuth2",\n      "product_code": "hotmail",\n      "price": 2.00,\n      "stock": 450\n    }\n  ]\n}`,
                      },
                      {
                        step: 'STEP 3 • BUY',
                        title: '3. Instant Buy Product (After User Enters Quantity)',
                        url: `${settings.site_url}/api.php/${currentUser?.api_key || 'YOUR_API_KEY'}/buy/hotmail/5`,
                        json: `{\n  "success": true,\n  "order_code": "ORD-8F92A1B3",\n  "qty": 2,\n  "total_price": 4.00,\n  "new_balance": 496.00,\n  "items": [\n    "user1@hotmail.com|Pass123|M.C510_BAY...|9e5f94bc-e8a4..."\n  ]\n}`,
                      },
                      {
                        step: 'STEP 4 • OTP',
                        title: '4. Read Mail Inbox & Extract Verification Code (OTP)',
                        url: `${settings.site_url}/api.php/${currentUser?.api_key || 'YOUR_API_KEY'}/code/EMAIL|PASS|TOKEN|CLIENT_ID`,
                        json: `{\n  "success": true,\n  "email": "user1@hotmail.com",\n  "latest_otp": "583920",\n  "message_count": 1\n}`,
                      },
                      {
                        step: 'STEP 5 • GET',
                        title: '5. Check Reseller Wallet Balance',
                        url: `${settings.site_url}/api.php/${currentUser?.api_key || 'YOUR_API_KEY'}/balance`,
                        json: `{\n  "success": true,\n  "name": "Reseller Name",\n  "balance": 496.00,\n  "currency": "${settings.currency}",\n  "api_status": "approved"\n}`,
                      },
                    ].map((ep, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                          marginBottom: 10,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            padding: '8px 11px',
                            background: 'var(--surface-alt)',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 6,
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span
                              style={{
                                background: 'var(--primary)',
                                color: '#fff',
                                fontSize: 10,
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: 5,
                              }}
                            >
                              {ep.step}
                            </span>
                            <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>
                              {ep.url}
                            </span>
                          </div>
                          <button
                            className="mrms-btn mrms-btn-outline"
                            onClick={() => {
                              navigator.clipboard.writeText(ep.url);
                              showToast('API URL Copied!');
                            }}
                          >
                            <i className="ri-file-copy-line"></i> Copy
                          </button>
                        </div>
                        <div style={{ padding: '11px 13px' }}>
                          <b style={{ fontSize: 12, color: 'var(--primary-dark)' }}>{ep.title}</b>
                          <pre className="code-pre mono">{ep.json}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </main>

          {/* ── FLOATING BOXED ICON BOTTOM DOCK (CUSTOMER PANEL QUICK ACTIONS: Store, Get OTP, Orders, Deposit) ── */}
          <nav className="mob-dock" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              {
                id: 'shop',
                label: 'Store',
                icon: storeCleanStyle ? 'ri-store-2-fill' : 'ri-store-2-line',
                color: '#2563EB',
                bg: '#EFF6FF',
                border: '#BFDBFE',
                auth: false,
              },
              {
                id: 'otp',
                label: 'Get OTP',
                icon: storeCleanStyle ? 'ri-mail-check-fill' : 'ri-mail-check-line',
                color: '#7C3AED',
                bg: '#F5F3FF',
                border: '#DDD6FE',
                auth: false,
              },
              {
                id: 'orders',
                label: 'Orders',
                icon: storeCleanStyle ? 'ri-shopping-bag-3-fill' : 'ri-shopping-bag-3-line',
                color: '#D97706',
                bg: '#FFFBEB',
                border: '#FDE68A',
                auth: true,
              },
              {
                id: 'deposit',
                label: 'Deposit',
                icon: storeCleanStyle ? 'ri-wallet-3-fill' : 'ri-wallet-3-line',
                color: '#059669',
                bg: '#ECFDF5',
                border: '#A7F3D0',
                auth: true,
              },
            ].map((tab) => {
              const isAct = storePage === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`dock-btn ${isAct ? 'active' : ''}`}
                  onClick={() => {
                    if (tab.auth && !currentUser) {
                      setAuthModalOpen(true);
                      return;
                    }
                    setStorePage(tab.id as any);
                  }}
                  style={
                    storeCleanStyle
                      ? {
                          color: isAct ? tab.color : '#64748B',
                          fontWeight: isAct ? 800 : 700,
                        }
                      : undefined
                  }
                >
                  <span
                    className="dock-ico-box"
                    style={
                      storeCleanStyle
                        ? {
                            background: isAct ? tab.color : tab.bg,
                            border: `1px solid ${isAct ? tab.color : tab.border}`,
                            color: isAct ? '#FFFFFF' : tab.color,
                            boxShadow: isAct ? `0 3px 8px ${tab.color}33` : 'none',
                            transform: isAct ? 'translateY(-1px)' : 'none',
                          }
                        : undefined
                    }
                  >
                    <i className={tab.icon}></i>
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* =====================================================================
          MODE 2: ADMIN PRO PANEL (EXACT admin.php MOBILE VIEW)
         ===================================================================== */}
      {studioMode === 'admin' && (
        <>
          {/* SLIDE-OUT LEFT DRAWER MENU (Exact admin.php lines 778-831) */}
          {adminDrawerOpen && (
            <div
              onClick={() => setAdminDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15,23,42,0.42)',
                backdropFilter: 'blur(4px)',
                zIndex: 200,
              }}
            />
          )}
          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 265,
              background: '#ffffff',
              zIndex: 210,
              transform: adminDrawerOpen ? 'translateX(0)' : 'translateX(-102%)',
              transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid #e2e8f0',
              boxShadow: '10px 0 35px rgba(15,23,42,0.12)',
            }}
          >
            <div
              style={{
                padding: 14,
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff',
              }}
            >
              <div
                onClick={() => {
                  setAdminSec('dashboard');
                  setAdminDrawerOpen(false);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                  }}
                >
                  <DuotoneIcon name="flash" size={18} stylePreset="fintech_solid" />
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a' }}>{settings.site_name}</div>
              </div>
              <button
                className="mrms-btn mrms-btn-outline"
                style={{ padding: '4px 8px' }}
                onClick={() => setAdminDrawerOpen(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div style={{ padding: 10, flex: 1, overflowY: 'auto' }}>
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--light)',
                  padding: '8px 10px 4px',
                  letterSpacing: '0.06em',
                }}
              >
                Overview & Catalog
              </div>
              {[
                {
                  id: 'dashboard',
                  icon: 'ri-dashboard-3-fill',
                  label: 'Dashboard',
                  badge: null,
                  color: '#2563eb',
                  bg: '#eff6ff',
                  border: '#bfdbfe',
                },
                {
                  id: 'categories',
                  icon: 'ri-folders-fill',
                  label: 'Categories',
                  badge: categories.length,
                  color: '#7c3aed',
                  bg: '#f5f3ff',
                  border: '#ddd6fe',
                },
                {
                  id: 'products',
                  icon: 'ri-box-3-fill',
                  label: 'Products',
                  badge: products.length,
                  color: '#0284c7',
                  bg: '#f0f9ff',
                  border: '#bae6fd',
                },
                {
                  id: 'upload',
                  icon: 'ri-upload-cloud-2-fill',
                  label: 'Upload Stock',
                  badge: null,
                  color: '#0d9488',
                  bg: '#f0fdfa',
                  border: '#99f6e4',
                },
              ].map((item) => {
                const isAct = adminSec === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setAdminSec(item.id as any);
                      setAdminDrawerOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 11px',
                      borderRadius: 10,
                      border: isAct ? `1px solid ${item.border}` : '1px solid transparent',
                      background: isAct ? item.bg : 'transparent',
                      color: isAct ? item.color : 'var(--text)',
                      fontSize: 12.5,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <i
                        className={item.icon}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: isAct ? item.color : item.bg,
                          color: isAct ? '#ffffff' : item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 15,
                          border: `1px solid ${item.border}`,
                        }}
                      ></i>
                      {item.label}
                    </span>
                    {item.badge !== null && (
                      <span
                        className="mrms-badge"
                        style={{
                          background: item.bg,
                          color: item.color,
                          border: `1px solid ${item.border}`,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--light)',
                  padding: '8px 10px 4px',
                  letterSpacing: '0.06em',
                }}
              >
                Customers & Finance
              </div>
              {[
                {
                  id: 'deposits',
                  icon: 'ri-wallet-3-fill',
                  label: 'Deposits',
                  badge: deposits.filter((d) => d.status === 'pending').length,
                  color: '#059669',
                  bg: '#ecfdf5',
                  border: '#a7f3d0',
                },
                {
                  id: 'users',
                  icon: 'ri-group-fill',
                  label: 'Users & API Key',
                  badge: users.filter((u) => u.api_status === 'pending').length,
                  color: '#d97706',
                  bg: '#fffbeb',
                  border: '#fde68a',
                },
                {
                  id: 'orders',
                  icon: 'ri-file-list-3-fill',
                  label: 'Orders Log',
                  badge: 0,
                  color: '#e11d48',
                  bg: '#fff1f2',
                  border: '#fecdd3',
                },
              ].map((item) => {
                const isAct = adminSec === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setAdminSec(item.id as any);
                      setAdminDrawerOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 11px',
                      borderRadius: 10,
                      border: isAct ? `1px solid ${item.border}` : '1px solid transparent',
                      background: isAct ? item.bg : 'transparent',
                      color: isAct ? item.color : 'var(--text)',
                      fontSize: 12.5,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <i
                        className={item.icon}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: isAct ? item.color : item.bg,
                          color: isAct ? '#ffffff' : item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 15,
                          border: `1px solid ${item.border}`,
                        }}
                      ></i>
                      {item.label}
                    </span>
                    {item.badge > 0 && (
                      <span
                        style={{
                          background: '#e11d48',
                          color: '#fff',
                          fontSize: 9.5,
                          padding: '1.5px 6px',
                          borderRadius: 99,
                          fontWeight: 800,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--light)',
                  padding: '8px 10px 4px',
                  letterSpacing: '0.06em',
                }}
              >
                Gateway & Store Config
              </div>
              {[
                {
                  id: 'settings',
                  icon: 'ri-settings-4-fill',
                  label: 'Store Settings',
                  color: '#4f46e5',
                  bg: '#eef2ff',
                  border: '#c7d2fe',
                },
              ].map((item) => {
                const isAct = adminSec === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setAdminSec(item.id as any);
                      setAdminDrawerOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 11px',
                      borderRadius: 10,
                      border: isAct ? `1px solid ${item.border}` : '1px solid transparent',
                      background: isAct ? item.bg : 'transparent',
                      color: isAct ? item.color : 'var(--text)',
                      fontSize: 12.5,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <i
                        className={item.icon}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: isAct ? item.color : item.bg,
                          color: isAct ? '#ffffff' : item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 15,
                          border: `1px solid ${item.border}`,
                        }}
                      ></i>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                padding: '10px 12px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                gap: 6,
              }}
            >
              <button
                className="mrms-btn mrms-btn-outline"
                style={{ flex: 1 }}
                onClick={() => {
                  setAdminDrawerOpen(false);
                  setStudioMode('store');
                }}
              >
                <i className="ri-store-2-line"></i> Shop
              </button>
              <button
                className="mrms-btn mrms-btn-danger"
                onClick={() => {
                  setAdminDrawerOpen(false);
                  showToast('Admin session active in preview');
                }}
              >
                <i className="ri-shut-down-line"></i> Logout
              </button>
            </div>
          </aside>

          {/* STICKY COMPACT TOP NAVBAR (Style 4 Clean Solid Pill) */}
          <header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
              height: 52,
              maxWidth: 480,
              width: '100%',
              margin: '0 auto',
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              borderLeft: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
            }}
          >
            <div
              style={{
                padding: '0 10px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <button
                  onClick={() => setAdminDrawerOpen(true)}
                  title="Menu"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                    cursor: 'pointer',
                  }}
                >
                  <i className="ri-menu-2-fill"></i>
                </button>
                <div
                  onClick={() => setAdminSec('dashboard')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 15,
                    }}
                  >
                    <DuotoneIcon name="flash" size={18} stylePreset="fintech_solid" />
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a' }}>{settings.site_name}</span>
                  <span className="mrms-badge mrms-b-blue">Admin</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <button className="mrms-btn mrms-btn-outline" onClick={() => setAdminSec('settings')}>
                  <i className="ri-settings-4-fill" style={{ color: '#4f46e5' }}></i> Settings
                </button>
                <button className="mrms-btn mrms-btn-primary" onClick={() => setStudioMode('store')}>
                  <i className="ri-external-link-line"></i> Store
                </button>
              </div>
            </div>
          </header>

          {/* Main Admin Container (Mobile View maxWidth: 480px - Style 4 Clean Solid Pill) */}
          <main
            className="store-fintech-solid"
            style={{
              maxWidth: 480,
              width: '100%',
              margin: '0 auto',
              padding: '12px 10px',
              flex: 1,
              background: '#f8fafc',
              borderLeft: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
            }}
          >
            {/* ADMIN 1: DASHBOARD (Mobile 2x2 Stats Grid + Live Stock Summary) */}
            {adminSec === 'dashboard' && (
              <section>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <h2 style={{ fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#2563eb',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                      }}
                    >
                      <i className="ri-dashboard-3-fill"></i>
                    </span>
                    Overview
                  </h2>
                  <button className="mrms-btn mrms-btn-outline" onClick={() => setAdminDrawerOpen(true)}>
                    <i className="ri-apps-2-fill" style={{ color: '#2563eb' }}></i> Menu
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div
                    onClick={() => setAdminSec('products')}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '11px 12px',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)' }}>PRODUCTS</div>
                      <div className="mono" style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: '#0f172a' }}>
                        {products.length}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: '#f5f3ff',
                        border: '1px solid #ddd6fe',
                        color: '#7c3aed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 17,
                      }}
                    >
                      <i className="ri-box-3-fill"></i>
                    </div>
                  </div>

                  <div
                    onClick={() => setAdminSec('upload')}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '11px 12px',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)' }}>STOCK</div>
                      <div className="mono" style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: '#0f172a' }}>
                        {totalAvailableStock.toLocaleString()}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        color: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 17,
                      }}
                    >
                      <i className="ri-database-2-fill"></i>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '11px 12px',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)' }}>SALES TODAY</div>
                      <div className="mono" style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: '#0f172a' }}>
                        {settings.currency}
                        {orders.reduce((s, o) => s + o.total_price, 0).toFixed(2)}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 17,
                      }}
                    >
                      <i className="ri-line-chart-fill"></i>
                    </div>
                  </div>

                  <div
                    onClick={() => setAdminSec('deposits')}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '11px 12px',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)' }}>DEPOSITS</div>
                      <div className="mono" style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: '#0f172a' }}>
                        {deposits.filter((d) => d.status === 'pending').length}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: '#fffbeb',
                        border: '1px solid #fde68a',
                        color: '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 17,
                      }}
                    >
                      <i className="ri-wallet-3-fill"></i>
                    </div>
                  </div>
                </div>

                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-stack-line"></i> Live Stock Summary
                    </h3>
                    <button className="mrms-btn mrms-btn-primary" onClick={() => setAdminSec('upload')}>
                      <i className="ri-add-line"></i> Add Stock
                    </button>
                  </div>
                  <div className="mrms-tbl-wrap">
                    <table className="mrms-tbl">
                      <thead>
                        <tr>
                          <th>ID & Product</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <b>
                                #{p.id} {p.name}
                              </b>{' '}
                              <code style={{ fontSize: 10, color: 'var(--muted)' }}>({p.slug})</code>
                            </td>
                            <td>
                              <span className="mrms-badge mrms-b-blue">{p.category}</span>
                            </td>
                            <td>
                              <b>
                                {settings.currency}
                                {p.price.toFixed(2)}
                              </b>
                            </td>
                            <td>
                              <b style={{ color: p.stockLines.length > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                {p.stockLines.length}
                              </b>
                            </td>
                            <td>
                              <span
                                className={`mrms-badge ${p.status === 'active' ? 'mrms-b-ok' : 'mrms-b-warn'}`}
                              >
                                {p.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* ADMIN 2: CATEGORIES (Mobile 1-Column) */}
            {adminSec === 'categories' && (
              <section>
                <div style={{ marginBottom: 12 }}>
                  <h2 style={{ fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ri-folders-line" style={{ color: 'var(--primary)', fontSize: 18 }}></i> Categories
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="mrms-card">
                    <div className="mrms-card-head">
                      <h3>
                        <i className="ri-add-circle-line"></i> Create Category
                      </h3>
                    </div>
                    <div className="mrms-card-body">
                      <div className="mrms-fg">
                        <label>Category Name *</label>
                        <input
                          type="text"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="e.g. Hotmail / Outlook"
                        />
                      </div>
                      <div className="mrms-fg">
                        <label>Vector Icon</label>
                        <select value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)}>
                          <option value="ri-mail-line">Mail Envelope (Hotmail / Mail)</option>
                          <option value="ri-microsoft-fill">Microsoft Logo (Outlook)</option>
                          <option value="ri-google-fill">Google Logo (Gmail)</option>
                          <option value="ri-global-line">Global Network (Proxy / VPN)</option>
                          <option value="ri-shield-keyhole-line">Security Shield (2FA)</option>
                          <option value="ri-server-line">Cloud Server (RDP / VPS)</option>
                          <option value="ri-facebook-circle-fill">Facebook Logo</option>
                          <option value="ri-vip-crown-line">VIP Crown</option>
                        </select>
                      </div>
                      <div className="mrms-fg">
                        <label>Sort Order</label>
                        <input
                          type="number"
                          value={newCatSort}
                          onChange={(e) => setNewCatSort(e.target.value)}
                        />
                      </div>
                      <button
                        className="mrms-btn mrms-btn-primary"
                        onClick={() => {
                          if (!newCatName.trim()) return showToast('Category name required!', true);
                          const slug = makeSlug(newCatName);
                          setCategories((prev) => [
                            ...prev,
                            {
                              id: prev.length + 1,
                              name: newCatName.trim(),
                              slug,
                              icon: newCatIcon,
                              sort_order: parseInt(newCatSort, 10) || 1,
                              status: 'active',
                            },
                          ]);
                          setNewCatName('');
                          showToast('Category created & synced with Customer Store!');
                        }}
                      >
                        <i className="ri-check-line"></i> Add Category
                      </button>
                    </div>
                  </div>

                  <div className="mrms-card">
                    <div className="mrms-card-head">
                      <h3>
                        <i className="ri-list-check"></i> All Categories
                      </h3>
                    </div>
                    <div className="mrms-tbl-wrap">
                      <table className="mrms-tbl">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Code (Slug)</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((c) => (
                            <tr key={c.id}>
                              <td>
                                <b style={{ color: 'var(--primary)' }}>
                                  <i className={c.icon}></i>{' '}
                                  <span style={{ color: 'var(--text)' }}>{c.name}</span>
                                </b>
                              </td>
                              <td className="mono">{c.slug}</td>
                              <td>
                                <button
                                  className="mrms-btn mrms-btn-danger"
                                  onClick={() => {
                                    setCategories((prev) => prev.filter((x) => x.id !== c.id));
                                    showToast(`Deleted category ${c.name}`);
                                  }}
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ADMIN 3: PRODUCTS (Mobile 1-Column) */}
            {adminSec === 'products' && (
              <section>
                <div style={{ marginBottom: 12 }}>
                  <h2 style={{ fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ri-box-3-line" style={{ color: 'var(--primary)', fontSize: 18 }}></i> Products
                  </h2>
                </div>
                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-add-box-line"></i> Create New Product
                    </h3>
                  </div>
                  <div className="mrms-card-body">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="mrms-fg">
                        <label>Product Name *</label>
                        <input
                          type="text"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          placeholder="e.g. Hotmail Fresh OAuth2"
                        />
                      </div>
                      <div className="mrms-fg">
                        <label>Category *</label>
                        <select value={newProdCat} onChange={(e) => setNewProdCat(e.target.value)}>
                          {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mrms-fg">
                        <label>Unit Price ({settings.currency}) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                        />
                      </div>
                      <div className="mrms-fg">
                        <label>Short Description (1 Line on Card)</label>
                        <input
                          type="text"
                          value={newProdDesc}
                          onChange={(e) => setNewProdDesc(e.target.value)}
                          placeholder="e.g. Added: 13 Nov | OAuth2 Enabled"
                        />
                      </div>
                    </div>
                    <div className="mrms-fg">
                      <label>Full Requirements / Introduction (Shown in Buy Popup)</label>
                      <textarea
                        rows={3}
                        value={newProdFullDesc}
                        onChange={(e) => setNewProdFullDesc(e.target.value)}
                        placeholder="Write full product requirements, rules, login instructions or warranty info here..."
                      />
                    </div>
                    <button
                      className="mrms-btn mrms-btn-primary"
                      onClick={() => {
                        if (!newProdName.trim()) return showToast('Product name required!', true);
                        const slug = makeSlug(newProdName);
                        setProducts((prev) => [
                          ...prev,
                          {
                            id: prev.length + 1,
                            name: newProdName.trim(),
                            slug,
                            category: newProdCat,
                            price: Math.max(0.01, parseFloat(newProdPrice) || 1),
                            description: newProdDesc.trim(),
                            full_description: newProdFullDesc.trim(),
                            status: 'active',
                            stockLines: [],
                          },
                        ]);
                        setNewProdName('');
                        setNewProdDesc('');
                        setNewProdFullDesc('');
                        showToast('Product created! Upload stock in the Upload Stock tab.');
                      }}
                    >
                      <i className="ri-add-line"></i> Create Product
                    </button>
                  </div>
                </div>

                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-archive-line"></i> Product List
                    </h3>
                  </div>
                  <div className="mrms-tbl-wrap">
                    <table className="mrms-tbl">
                      <thead>
                        <tr>
                          <th>ID & Name</th>
                          <th>Cat</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <b>
                                #{p.id} {p.name}
                              </b>
                              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
                                {p.slug}
                              </div>
                            </td>
                            <td>
                              <span className="mrms-badge mrms-b-blue">{p.category}</span>
                            </td>
                            <td>
                              <b>
                                {settings.currency}
                                {p.price.toFixed(2)}
                              </b>
                            </td>
                            <td>
                              <b>{p.stockLines.length}</b>
                            </td>
                            <td>
                              <span
                                className={`mrms-badge ${p.status === 'active' ? 'mrms-b-ok' : 'mrms-b-warn'}`}
                              >
                                {p.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ display: 'flex', gap: 4 }}>
                              <button
                                className="mrms-btn mrms-btn-outline"
                                onClick={() => setEditProdModal(p)}
                                title="Edit Product"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                className="mrms-btn mrms-btn-outline"
                                onClick={() =>
                                  setProducts((prev) =>
                                    prev.map((x) =>
                                      x.id === p.id
                                        ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' }
                                        : x
                                    )
                                  )
                                }
                                title="Toggle Status"
                              >
                                <i className="ri-refresh-line"></i>
                              </button>
                              <button
                                className="mrms-btn mrms-btn-danger"
                                onClick={() => {
                                  setProducts((prev) => prev.filter((x) => x.id !== p.id));
                                  showToast(`Deleted product ${p.name}`);
                                }}
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* ADMIN 4: UPLOAD STOCK */}
            {adminSec === 'upload' && (
              <section>
                <div style={{ marginBottom: 12 }}>
                  <h2 style={{ fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ri-upload-cloud-2-line" style={{ color: 'var(--primary)', fontSize: 18 }}></i> Upload
                    Stock
                  </h2>
                </div>
                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-file-upload-line"></i> Add Accounts to Product
                    </h3>
                  </div>
                  <div className="mrms-card-body">
                    <div className="mrms-fg">
                      <label>Select Product *</label>
                      <select value={upProdId} onChange={(e) => setUpProdId(e.target.value)}>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.stockLines.length})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mrms-fg">
                      <label>Paste Account Lines (1 per line)</label>
                      <textarea
                        rows={6}
                        className="mono"
                        value={upText}
                        onChange={(e) => setUpText(e.target.value)}
                        placeholder="email@hotmail.com|password|refresh_token|client_id"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="mrms-fg">
                        <label>Or Select .TXT File</label>
                        <input
                          type="file"
                          accept=".txt,.csv"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            f.text().then((txt) => setUpText((prev) => (prev ? prev + '\n' + txt : txt)));
                          }}
                        />
                      </div>
                      <div className="mrms-fg">
                        <label>Or Remote URL</label>
                        <input type="text" placeholder="https://..." />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="mrms-btn mrms-btn-primary"
                        onClick={() => {
                          const lines = upText
                            .split('\n')
                            .map((l) => l.trim())
                            .filter(Boolean);
                          if (lines.length === 0) return showToast('Paste at least 1 stock line!', true);
                          const pid = parseInt(upProdId, 10);
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id === pid ? { ...p, stockLines: [...p.stockLines, ...lines] } : p
                            )
                          );
                          setUpText('');
                          showToast(`Uploaded ${lines.length} items to stock!`);
                        }}
                      >
                        <i className="ri-upload-2-line"></i> Upload Stock
                      </button>
                      <button
                        className="mrms-btn mrms-btn-danger"
                        onClick={() => {
                          const pid = parseInt(upProdId, 10);
                          setProducts((prev) =>
                            prev.map((p) => (p.id === pid ? { ...p, stockLines: [] } : p))
                          );
                          showToast('Cleared stock for selected product!');
                        }}
                      >
                        <i className="ri-delete-bin-2-line"></i> Clear Stock
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ADMIN 5: DEPOSITS (Auto & Manual + Screenshot Proof Viewer) */}
            {adminSec === 'deposits' && (
              <section>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <h2 style={{ fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ri-wallet-3-line" style={{ color: 'var(--primary)', fontSize: 18 }}></i> Deposit
                    Requests
                  </h2>
                  <button className="mrms-btn mrms-btn-outline" onClick={handleSimulateBackgroundAutoMatch}>
                    <i className="ri-refresh-line"></i> Sync & Auto-Match
                  </button>
                </div>
                <div className="mrms-card">
                  <div className="mrms-tbl-wrap">
                    <table className="mrms-tbl">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Method</th>
                          <th>Amount</th>
                          <th>TrxID</th>
                          <th>Proof</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deposits.map((d) => (
                          <tr key={d.id}>
                            <td>
                              <b>{d.user_name}</b>
                              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{d.user_email}</div>
                            </td>
                            <td>
                              <b>{d.method}</b>
                              <div className="mono" style={{ fontSize: 10 }}>
                                {d.sender_num}
                              </div>
                            </td>
                            <td>
                              <b style={{ color: 'var(--primary)' }}>
                                {settings.currency}
                                {d.amount.toFixed(2)}
                              </b>
                            </td>
                            <td className="mono">
                              <b>{d.trx_id}</b>
                            </td>
                            <td>
                              {d.screenshot ? (
                                <button
                                  className="mrms-btn mrms-btn-outline"
                                  style={{ padding: '4px 8px', fontSize: 10.5 }}
                                  onClick={() => setScreenPreviewDep(d)}
                                >
                                  <i className="ri-image-line"></i> Screenshot
                                </button>
                              ) : (
                                <span style={{ fontSize: 10, color: 'var(--light)' }}>None</span>
                              )}
                            </td>
                            <td>
                              <span
                                className={`mrms-badge ${
                                  d.status === 'approved'
                                    ? 'mrms-b-ok'
                                    : d.status === 'rejected'
                                    ? 'mrms-b-err'
                                    : 'mrms-b-warn'
                                }`}
                              >
                                {d.status.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              {d.status === 'pending' ? (
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <button
                                    className="mrms-btn mrms-btn-success"
                                    onClick={() => {
                                      setDeposits((prev) =>
                                        prev.map((x) => (x.id === d.id ? { ...x, status: 'approved' } : x))
                                      );
                                      setUsers((prev) =>
                                        prev.map((u) =>
                                          u.id === d.user_id
                                            ? { ...u, balance: Number((u.balance + d.amount).toFixed(2)) }
                                            : u
                                        )
                                      );
                                      showToast(`Approved ${settings.currency}${d.amount} deposit!`);
                                    }}
                                  >
                                    <i className="ri-check-line"></i> Approve
                                  </button>
                                  <button
                                    className="mrms-btn mrms-btn-danger"
                                    onClick={() => {
                                      setDeposits((prev) =>
                                        prev.map((x) => (x.id === d.id ? { ...x, status: 'rejected' } : x))
                                      );
                                      showToast('Deposit rejected.');
                                    }}
                                  >
                                    <i className="ri-close-line"></i>
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: 10.5, color: 'var(--light)' }}>Done</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* ADMIN 6: USERS & API */}
            {adminSec === 'users' && (
              <section>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <h2 style={{ fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ri-group-line" style={{ color: 'var(--primary)', fontSize: 18 }}></i> Users & API
                    Approvals ({users.length})
                  </h2>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by Email, Name or #ID..."
                    style={{
                      width: '100%',
                      padding: '7px 11px',
                      borderRadius: 9,
                      border: '1px solid #cbd5e1',
                      fontSize: 12,
                      background: '#fff',
                    }}
                  />
                </div>
                <div className="mrms-card">
                  <div className="mrms-tbl-wrap">
                    <table className="mrms-tbl">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Balance</th>
                          <th>API Status</th>
                          <th>API Action</th>
                          <th>Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter(
                            (u) =>
                              !userSearch.trim() ||
                              `${u.id} ${u.name} ${u.email}`
                                .toLowerCase()
                                .includes(userSearch.trim().toLowerCase())
                          )
                          .map((u) => (
                            <tr key={u.id}>
                              <td>
                                <b>
                                  #{u.id} {u.name}
                                </b>
                              </td>
                              <td className="mono" style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>
                                {u.email}
                              </td>
                              <td>
                                <b style={{ color: 'var(--primary)' }}>
                                  {settings.currency}
                                  {u.balance.toFixed(2)}
                                </b>
                              </td>
                              <td>
                                <span
                                  className={`mrms-badge ${
                                    u.api_status === 'approved'
                                      ? 'mrms-b-ok'
                                      : u.api_status === 'pending'
                                      ? 'mrms-b-warn'
                                      : 'mrms-b-blue'
                                  }`}
                                >
                                  {u.api_status.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                {u.api_status !== 'approved' ? (
                                  <button
                                    className="mrms-btn mrms-btn-success"
                                    onClick={() => {
                                      const key =
                                        u.api_key ||
                                        'mrms_' +
                                          Array.from({ length: 32 }, () =>
                                            Math.floor(Math.random() * 16).toString(16)
                                          ).join('');
                                      setUsers((prev) =>
                                        prev.map((x) =>
                                          x.id === u.id ? { ...x, api_status: 'approved', api_key: key } : x
                                        )
                                      );
                                      showToast(`API Approved for ${u.name}!`);
                                    }}
                                  >
                                    <i className="ri-key-2-line"></i> Approve
                                  </button>
                                ) : (
                                  <button
                                    className="mrms-btn mrms-btn-danger"
                                    onClick={() => {
                                      setUsers((prev) =>
                                        prev.map((x) => (x.id === u.id ? { ...x, api_status: 'revoked' } : x))
                                      );
                                      showToast(`API Revoked for ${u.name}`);
                                    }}
                                  >
                                    <i className="ri-forbid-line"></i> Revoke
                                  </button>
                                )}
                              </td>
                              <td style={{ display: 'flex', gap: 4 }}>
                                <button
                                  className="mrms-btn mrms-btn-outline"
                                  onClick={() => {
                                    setBalModalUser(u);
                                    setBalAdjustAmount('100');
                                  }}
                                >
                                  <i className="ri-coins-line"></i> +/-
                                </button>
                                <button
                                  className="mrms-btn mrms-btn-danger"
                                  onClick={() => {
                                    setUsers((prev) =>
                                      prev.map((x) =>
                                        x.id === u.id
                                          ? { ...x, status: x.status === 'active' ? 'banned' : 'active' }
                                          : x
                                      )
                                    );
                                    showToast('User status updated!');
                                  }}
                                >
                                  {u.status === 'active' ? 'Ban' : 'Unban'}
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* ADMIN 7: ORDERS LOG (Exact admin.php lines 1107-1129) */}
            {adminSec === 'orders' && (
              <section>
                <div style={{ marginBottom: 12 }}>
                  <h2 style={{ fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ri-file-list-3-line" style={{ color: 'var(--primary)', fontSize: 18 }}></i> Orders Log
                  </h2>
                </div>
                <div className="mrms-card">
                  <div className="mrms-tbl-wrap">
                    <table className="mrms-tbl">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>User</th>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Paid</th>
                          <th>Via</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.id}>
                            <td className="mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                              {o.order_code}
                            </td>
                            <td>{o.user_email}</td>
                            <td>
                              <b>{o.product_name}</b>
                            </td>
                            <td>{o.qty}</td>
                            <td>
                              <b>
                                {settings.currency}
                                {o.total_price.toFixed(2)}
                              </b>
                            </td>
                            <td>
                              <span className="mrms-badge mrms-b-blue">{o.buy_source.toUpperCase()}</span>
                            </td>
                            <td style={{ fontSize: 10.5, color: 'var(--muted)' }}>{o.created_at}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* ADMIN 8: PAYMENT GATEWAY & STORE SETTINGS */}
            {adminSec === 'settings' && (
              <section>
                <div style={{ marginBottom: 12 }}>
                  <h2 style={{ fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ri-settings-4-line" style={{ color: 'var(--primary)', fontSize: 18 }}></i> Payment
                    Gateway & Store Settings
                  </h2>
                </div>

                {/* Card 1: Own Payment Methods ON/OFF & Numbers */}
                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-shield-flash-line"></i> 1. Own Payment Methods (ON / OFF)
                    </h3>
                    <span className="mrms-badge mrms-b-ok">Instant Control</span>
                  </div>
                  <div className="mrms-card-body">
                    {/* bKash */}
                    <div style={{ display: 'grid', gridTemplateColumns: '115px 1fr', gap: 8, marginBottom: 9 }}>
                      <div className="mrms-fg" style={{ margin: 0 }}>
                        <label>bKash Status</label>
                        <select
                          value={settings.bkash_status}
                          onChange={(e) =>
                            setSettings({ ...settings, bkash_status: e.target.value as '1' | '0' })
                          }
                        >
                          <option value="1">ON (Active)</option>
                          <option value="0">OFF (Hidden)</option>
                        </select>
                      </div>
                      <div className="mrms-fg" style={{ margin: 0 }}>
                        <label>bKash Personal Number</label>
                        <input
                          type="text"
                          value={settings.bkash_number}
                          onChange={(e) => setSettings({ ...settings, bkash_number: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Nagad */}
                    <div style={{ display: 'grid', gridTemplateColumns: '115px 1fr', gap: 8, marginBottom: 9 }}>
                      <div className="mrms-fg" style={{ margin: 0 }}>
                        <label>Nagad Status</label>
                        <select
                          value={settings.nagad_status}
                          onChange={(e) =>
                            setSettings({ ...settings, nagad_status: e.target.value as '1' | '0' })
                          }
                        >
                          <option value="1">ON (Active)</option>
                          <option value="0">OFF (Hidden)</option>
                        </select>
                      </div>
                      <div className="mrms-fg" style={{ margin: 0 }}>
                        <label>Nagad Personal Number</label>
                        <input
                          type="text"
                          value={settings.nagad_number}
                          onChange={(e) => setSettings({ ...settings, nagad_number: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Binance */}
                    <div style={{ display: 'grid', gridTemplateColumns: '115px 1fr', gap: 8, marginBottom: 9 }}>
                      <div className="mrms-fg" style={{ margin: 0 }}>
                        <label>Binance Status</label>
                        <select
                          value={settings.binance_status}
                          onChange={(e) =>
                            setSettings({ ...settings, binance_status: e.target.value as '1' | '0' })
                          }
                        >
                          <option value="1">ON (Active)</option>
                          <option value="0">OFF (Hidden)</option>
                        </select>
                      </div>
                      <div className="mrms-fg" style={{ margin: 0 }}>
                        <label>Binance Pay ID / UID</label>
                        <input
                          type="text"
                          value={settings.binance_id}
                          onChange={(e) => setSettings({ ...settings, binance_id: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div className="mrms-fg" style={{ margin: 0 }}>
                        <label>Binance Rate (1 USDT = {settings.currency})</label>
                        <input
                          type="number"
                          value={settings.binance_rate}
                          onChange={(e) => setSettings({ ...settings, binance_rate: e.target.value })}
                        />
                      </div>
                      <div className="mrms-fg" style={{ margin: 0 }}>
                        <label>Minimum Deposit ({settings.currency})</label>
                        <input
                          type="number"
                          value={settings.min_deposit}
                          onChange={(e) => setSettings({ ...settings, min_deposit: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Auto-Verify API & Store Config */}
                <div className="mrms-card">
                  <div className="mrms-card-head">
                    <h3>
                      <i className="ri-key-2-line"></i> 2. Auto-Verify API & Store Config
                    </h3>
                    <span className="mrms-badge mrms-b-blue">Background Engine</span>
                  </div>
                  <div className="mrms-card-body">
                    <div className="mrms-fg">
                      <label>
                        <i className="ri-bit-coin-line"></i> Binance Read-Only API Key (For Auto-Approve)
                      </label>
                      <input
                        type="text"
                        className="mono"
                        placeholder="Paste Binance Read-Only API Key..."
                        value={settings.binance_api_key}
                        onChange={(e) => setSettings({ ...settings, binance_api_key: e.target.value })}
                      />
                    </div>
                    <div className="mrms-fg">
                      <label>
                        <i className="ri-lock-password-line"></i> Binance Read-Only Secret Key
                      </label>
                      <input
                        type="password"
                        className="mono"
                        placeholder="Paste Binance Secret Key..."
                        value={settings.binance_api_secret}
                        onChange={(e) => setSettings({ ...settings, binance_api_secret: e.target.value })}
                      />
                    </div>
                    <div className="mrms-fg">
                      <label>
                        <i className="ri-smartphone-line"></i> Own Android SMS Sync Secret Key & App
                      </label>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 7 }}>
                        <input
                          type="text"
                          className="mono"
                          value={settings.sms_sync_secret}
                          onChange={(e) => setSettings({ ...settings, sms_sync_secret: e.target.value })}
                        />
                        <button
                          type="button"
                          className="mrms-btn mrms-btn-outline"
                          onClick={() => {
                            const url = `${settings.site_url.replace(/\/$/, '')}/api.php?action=own_sms_sync`;
                            navigator.clipboard.writeText(`${url}|${settings.sms_sync_secret}`);
                            showToast('1-Click Setup Code Copied! Paste inside MRMS AutoPay App.');
                          }}
                        >
                          <i className="ri-file-copy-2-line"></i> Copy 1-Click Setup
                        </button>
                      </div>
                      <div
                        style={{
                          background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)',
                          border: '1px solid #6ee7b7',
                          borderRadius: 10,
                          padding: '9px 11px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 8,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11.5, fontWeight: 800, color: '#065f46' }}>
                            <i className="ri-android-fill"></i> MRMS AutoPay Android App (21 KB)
                          </div>
                          <div style={{ fontSize: 10, color: '#047857' }}>
                            Ultra-Light • 24/7 Never-Sleep • Auto-Start on Reboot
                          </div>
                        </div>
                        <a
                          href="/MRMS_AutoPay.apk"
                          download="MRMS_AutoPay.apk"
                          className="mrms-btn mrms-btn-success"
                          style={{ padding: '6px 11px', fontSize: 11, textDecoration: 'none' }}
                        >
                          <i className="ri-download-cloud-2-line"></i> Download App (.APK)
                        </a>
                      </div>
                    </div>
                    <div className="mrms-fg">
                      <label>Support Link</label>
                      <input
                        type="text"
                        value={settings.support_link}
                        onChange={(e) => setSettings({ ...settings, support_link: e.target.value })}
                      />
                    </div>
                    <div className="mrms-fg">
                      <label>Store Notice</label>
                      <input
                        type="text"
                        value={settings.site_notice}
                        onChange={(e) => setSettings({ ...settings, site_notice: e.target.value })}
                      />
                    </div>
                    <div className="mrms-fg">
                      <label>Google OAuth Client ID</label>
                      <input
                        type="text"
                        value={settings.google_client_id}
                        onChange={(e) => setSettings({ ...settings, google_client_id: e.target.value })}
                      />
                    </div>
                    <button
                      className="mrms-btn mrms-btn-primary"
                      style={{ width: '100%', padding: 9 }}
                      onClick={() => showToast('Payment & Store Settings saved!')}
                    >
                      <i className="ri-save-line"></i> Save All Gateway & Store Settings
                    </button>
                  </div>
                </div>
              </section>
            )}
          </main>

          {/* ── FLOATING BOXED ICON BOTTOM DOCK (ADMIN PANEL QUICK ACTIONS - STYLE 4 CLEAN SOLID PILL) ── */}
          <nav
            className="mob-dock"
            style={{
              gridTemplateColumns: 'repeat(5, 1fr)',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
            }}
          >
            {[
              { id: 'dashboard', label: 'Home', icon: 'ri-dashboard-3-fill', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
              { id: 'products', label: 'Products', icon: 'ri-box-3-fill', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
              { id: 'upload', label: 'Stock', icon: 'ri-upload-cloud-2-fill', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
              { id: 'deposits', label: 'Deposits', icon: 'ri-wallet-3-fill', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
              { id: 'settings', label: 'Settings', icon: 'ri-settings-4-fill', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
            ].map((tab) => {
              const isAct = adminSec === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`dock-btn ${isAct ? 'active' : ''}`}
                  onClick={() => setAdminSec(tab.id as any)}
                  style={{
                    color: isAct ? tab.color : 'var(--muted)',
                    fontWeight: isAct ? 800 : 700,
                  }}
                >
                  <span
                    className="dock-ico-box"
                    style={{
                      background: isAct ? tab.color : tab.bg,
                      color: isAct ? '#ffffff' : tab.color,
                      borderColor: isAct ? tab.color : tab.border,
                      boxShadow: isAct ? `0 4px 10px ${tab.color}33` : 'none',
                      transform: isAct ? 'translateY(-1.5px)' : 'none',
                    }}
                  >
                    <i className={tab.icon}></i>
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ADMIN EDIT PRODUCT MODAL */}
          {editProdModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15,23,42,0.52)',
                backdropFilter: 'blur(5px)',
                zIndex: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 14,
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 18,
                  width: '100%',
                  maxWidth: 370,
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 24px 60px rgba(15,23,42,0.22)',
                }}
              >
                <div
                  style={{
                    padding: '12px 15px',
                    background: '#ffffff',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="ri-edit-box-fill" style={{ color: '#2563eb' }}></i> Edit Product
                  </h3>
                  <button
                    className="mrms-btn mrms-btn-outline"
                    style={{ padding: '3px 7px' }}
                    onClick={() => setEditProdModal(null)}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
                <div style={{ padding: 15 }}>
                  <div className="mrms-fg">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={editProdModal.name}
                      onChange={(e) => setEditProdModal({ ...editProdModal, name: e.target.value })}
                    />
                  </div>
                  <div className="mrms-fg">
                    <label>Category</label>
                    <select
                      value={editProdModal.category}
                      onChange={(e) => setEditProdModal({ ...editProdModal, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mrms-fg">
                    <label>Price ({settings.currency})</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editProdModal.price}
                      onChange={(e) =>
                        setEditProdModal({ ...editProdModal, price: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="mrms-fg">
                    <label>Short Description (1 Line)</label>
                    <input
                      type="text"
                      value={editProdModal.description}
                      onChange={(e) => setEditProdModal({ ...editProdModal, description: e.target.value })}
                    />
                  </div>
                  <div className="mrms-fg">
                    <label>Full Requirements / Introduction (Popup)</label>
                    <textarea
                      rows={3}
                      value={editProdModal.full_description}
                      onChange={(e) => setEditProdModal({ ...editProdModal, full_description: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                    <button className="mrms-btn mrms-btn-outline" onClick={() => setEditProdModal(null)}>
                      Cancel
                    </button>
                    <button
                      className="mrms-btn mrms-btn-primary"
                      onClick={() => {
                        setProducts((prev) =>
                          prev.map((x) => (x.id === editProdModal.id ? editProdModal : x))
                        );
                        setEditProdModal(null);
                        showToast('Product updated!');
                      }}
                    >
                      <i className="ri-check-line"></i> Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* =====================================================================
          MODE 2.5: STANDALONE CODE EDITOR & PATCHER (editor.php - STYLE 4 CLEAN SOLID PILL)
         ===================================================================== */}
      {studioMode === 'editor' && (
        <>
          <header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
              height: 52,
              maxWidth: 480,
              width: '100%',
              margin: '0 auto',
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              borderLeft: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
            }}
          >
            <div
              style={{
                padding: '0 10px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: '#eef2ff',
                    border: '1px solid #c7d2fe',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                  }}
                >
                  <i className="ri-code-s-slash-fill"></i>
                </div>
                <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a' }}>Code Editor</span>
                <span
                  className="mrms-badge"
                  style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}
                >
                  Universal
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <button className="mrms-btn mrms-btn-outline" onClick={() => setStudioMode('admin')}>
                  <i className="ri-shield-keyhole-fill" style={{ color: '#2563eb' }}></i> Admin
                </button>
                <button className="mrms-btn mrms-btn-primary" onClick={() => setStudioMode('store')}>
                  <i className="ri-store-2-fill"></i> Store
                </button>
              </div>
            </div>
          </header>

          <main
            className="store-fintech-solid"
            style={{
              maxWidth: 480,
              width: '100%',
              margin: '0 auto',
              padding: '12px 10px',
              flex: 1,
              background: '#f8fafc',
              borderLeft: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
            }}
          >
            <section>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <h2 style={{ fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: '#eef2ff',
                      border: '1px solid #c7d2fe',
                      color: '#4f46e5',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                    }}
                  >
                    <i className="ri-file-code-fill"></i>
                  </span>
                  Code Patcher & File Updater
                </h2>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button className="mrms-btn mrms-btn-primary" onClick={handleDownloadAllTxtBundle}>
                    <i className="ri-file-download-fill"></i> Download All (.TXT)
                  </button>
                  <a
                    href="/assets/aistudio/MRMS_Mart_All_Files_2026-11-13_20-09_a3953d8d.zip"
                    download="MRMS_Mart_All_Files.zip"
                    className="mrms-btn mrms-btn-outline"
                  >
                    <i className="ri-folder-zip-fill" style={{ color: '#d97706' }}></i> Backup (.ZIP)
                  </a>
                  <select
                    value={selectedPhpFile}
                    onChange={(e) => {
                      setSelectedPhpFile(e.target.value);
                      setPatchMatchInfo(null);
                    }}
                    style={{
                      padding: '5px 9px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontWeight: 800,
                      fontSize: 11.5,
                      color: '#0f172a',
                      background: '#fff',
                    }}
                  >
                    <option value="index.php">Customer Storefront (index.php)</option>
                    <option value="admin.php">Admin Control Panel (admin.php)</option>
                    <option value="api.php">Master API Engine (api.php)</option>
                    <option value="db.php">Database & Schema (db.php)</option>
                    <option value="config.php">Configuration (config.php)</option>
                    <option value="editor.php">Code Editor & Patcher (editor.php)</option>
                  </select>
                  {phpBackups[selectedPhpFile] && (
                    <button
                      className="mrms-btn mrms-btn-danger"
                      onClick={() => {
                        setPhpFiles((prev) => ({
                          ...prev,
                          [selectedPhpFile]: phpBackups[selectedPhpFile],
                        }));
                        showToast(`Restored backup of ${selectedPhpFile}!`);
                      }}
                    >
                      <i className="ri-history-line"></i> Undo
                    </button>
                  )}
                </div>
              </div>

              {/* 1. TOP: DIRECT FILE UPLOAD & REPLACE */}
              <div className="mrms-card">
                <div className="mrms-card-head">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#2563eb',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                      }}
                    >
                      <i className="ri-upload-cloud-2-fill" style={{ color: '#2563eb', fontSize: 13 }}></i>
                    </span>
                    <span>
                      1. Direct File Upload & Replace (
                      <span style={{ color: '#2563eb' }}>{selectedPhpFile}</span>)
                    </span>
                  </h3>
                </div>
                <div className="mrms-card-body">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept=".php,.txt,.html,.js,.css,.json"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        f.text().then((txt) => {
                          setPhpBackups((prev) => ({ ...prev, [selectedPhpFile]: phpFiles[selectedPhpFile] || '' }));
                          setPhpFiles((prev) => ({ ...prev, [selectedPhpFile]: txt }));
                          showToast(`Uploaded & replaced ${selectedPhpFile}!`);
                        });
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                        background: '#fff',
                      }}
                    />
                    <button
                      className="mrms-btn mrms-btn-primary"
                      style={{ padding: '8px 14px' }}
                      onClick={() => showToast(`Ready to upload & replace ${selectedPhpFile}!`)}
                    >
                      <i className="ri-rocket-2-fill"></i> Upload & Replace File
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. MIDDLE: QUICK FIND & REPLACE (2-Step Safe Patcher) */}
              <div className="mrms-card">
                <div className="mrms-card-head">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#059669',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                      }}
                    >
                      <i className="ri-find-replace-fill" style={{ color: '#059669', fontSize: 13 }}></i>
                    </span>
                    <span>2. Quick Find & Replace (2-Step Safe Patcher)</span>
                  </h3>
                </div>
                <div className="mrms-card-body">
                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="mrms-fg" style={{ margin: 0 }}>
                      <label>Find Specific Code Lines (Old Code)</label>
                      <textarea
                        rows={3}
                        className="mono"
                        value={findText}
                        onChange={(e) => {
                          setFindText(e.target.value);
                          setPatchMatchInfo(null);
                        }}
                        placeholder="Paste the 1-3 lines you want to find..."
                      />
                    </div>
                    <div className="mrms-fg" style={{ margin: 0 }}>
                      <label>Replace With New Code Lines</label>
                      <textarea
                        rows={3}
                        className="mono"
                        value={replaceText}
                        onChange={(e) => setReplaceText(e.target.value)}
                        placeholder="Paste the new replacement lines here..."
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button
                      className={`mrms-btn ${patchMatchInfo ? 'mrms-btn-success' : 'mrms-btn-primary'}`}
                      style={{ flex: 1, padding: 9 }}
                      onClick={handleSmartFindOrReplace}
                    >
                      <i className={patchMatchInfo ? 'ri-magic-fill' : 'ri-search-eye-fill'}></i>{' '}
                      {patchMatchInfo
                        ? `Confirm Replace & Save (Line ${patchMatchInfo.line})`
                        : 'Find & Highlight in Terminal'}
                    </button>
                    {patchMatchInfo && (
                      <button
                        className="mrms-btn mrms-btn-danger"
                        style={{ padding: '9px 14px' }}
                        onClick={() => setPatchMatchInfo(null)}
                      >
                        <i className="ri-close-circle-line"></i> Cancel
                      </button>
                    )}
                  </div>
                  {patchMatchInfo && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        background: 'var(--success-bg)',
                        color: '#059669',
                      }}
                    >
                      <i className="ri-checkbox-circle-fill"></i> Match highlighted at Line {patchMatchInfo.line} (
                      {patchMatchInfo.count} match). Click green button above to Replace or Cancel!
                    </div>
                  )}
                </div>
              </div>

              {/* 3. BOTTOM: SOURCE TERMINAL */}
              <div className="mrms-card">
                <div className="mrms-card-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: '#f5f3ff',
                          border: '1px solid #ddd6fe',
                          color: '#7c3aed',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                        }}
                      >
                        <i className="ri-terminal-box-fill" style={{ color: '#7c3aed', fontSize: 13 }}></i>
                      </span>
                      <span>3. Source Terminal (Selectable & Copyable)</span>
                    </h3>
                    <span className="mrms-badge mrms-b-blue">
                      <i className="ri-cursor-fill"></i> Select & Copy Enabled
                    </span>
                    <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                      {getUtf8ByteSize(phpFiles[selectedPhpFile] || '').toLocaleString()} bytes
                    </span>
                  </div>
                  <button
                    className="mrms-btn mrms-btn-outline"
                    onClick={() => {
                      navigator.clipboard.writeText(phpFiles[selectedPhpFile] || '');
                      showToast('Full code copied!');
                    }}
                  >
                    <i className="ri-file-copy-line"></i> Copy All
                  </button>
                </div>
                <div className="mrms-card-body">
                  <textarea
                    value={phpFiles[selectedPhpFile] || ''}
                    onChange={(e) =>
                      setPhpFiles((prev) => ({ ...prev, [selectedPhpFile]: e.target.value }))
                    }
                    className="mono"
                    style={{
                      width: '100%',
                      height: 360,
                      background: '#0f172a',
                      color: '#e2e8f0',
                      padding: 12,
                      borderRadius: 10,
                      border: '1px solid #334155',
                      fontSize: 11.5,
                      lineHeight: 1.5,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </section>
          </main>
        </>
      )}

      {/* =====================================================================
          MODE 3: PHP SOURCE FILES & 1-CLICK EXPORTER
         ===================================================================== */}
      {studioMode === 'code' && (
        <main style={{ maxWidth: 1140, width: '100%', margin: '0 auto', padding: '16px 10px' }}>
          <div className="mrms-card">
            <div className="mrms-card-head">
              <h3>
                <i className="ri-folder-zip-line"></i> Your 6 PHP Hosting Files (Including Standalone editor.php)
              </h3>
              <button className="mrms-btn mrms-btn-primary" onClick={handleDownloadAllTxtBundle}>
                <i className="ri-file-download-line"></i> Download All 6 Files (.TXT Bundle)
              </button>
            </div>
            <div className="mrms-card-body">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2.5 mb-3">
                {['config.php', 'db.php', 'api.php', 'index.php', 'admin.php', 'editor.php'].map((fn) => (
                  <div
                    key={fn}
                    onClick={() => setSelectedPhpFile(fn)}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      border:
                        selectedPhpFile === fn
                          ? '2px solid var(--primary)'
                          : '1px solid var(--border)',
                      background: selectedPhpFile === fn ? 'var(--primary-light)' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 12.5, color: 'var(--primary-dark)' }}>{fn}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', margin: '3px 0 8px' }}>
                      {getUtf8ByteSize(phpFiles[fn] || '').toLocaleString()} bytes
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="mrms-btn mrms-btn-primary"
                        style={{ flex: 1, padding: '4px 6px', fontSize: 10.5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSinglePhp(fn);
                        }}
                      >
                        <i className="ri-download-2-line"></i> .PHP
                      </button>
                      <button
                        className="mrms-btn mrms-btn-outline"
                        style={{ padding: '4px 6px', fontSize: 10.5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(phpFiles[fn] || '');
                          showToast(`Copied ${fn}!`);
                        }}
                      >
                        <i className="ri-file-copy-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <textarea
                value={phpFiles[selectedPhpFile] || ''}
                onChange={(e) => setPhpFiles((prev) => ({ ...prev, [selectedPhpFile]: e.target.value }))}
                className="mono"
                style={{
                  width: '100%',
                  height: 440,
                  background: '#0f172a',
                  color: '#e2e8f0',
                  padding: 12,
                  borderRadius: 10,
                  border: '1px solid #334155',
                  fontSize: 11.5,
                  lineHeight: 1.5,
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          MODE 4: ANDROID APP LIVE PREVIEW (FINALIZED CLEAN SOLID PILL STYLE)
         ===================================================================== */}
      {studioMode === 'app' && (
        <main
          style={{
            maxWidth: 460,
            width: '100%',
            margin: '12px auto',
            padding: 12,
            background: '#F8FAFC',
            borderRadius: 20,
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 20px 50px rgba(15,23,42,0.10)',
          }}
        >
          {/* Website-Matching Top Navbar Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: '11px 12px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 9,
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background:
                    iconPreset === 'ios_clean'
                      ? '#2563EB'
                      : iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke'
                      ? '#F8FAFC'
                      : iconPreset === 'fintech_solid'
                      ? '#EFF6FF'
                      : iconPreset === 'flatcolor'
                      ? '#1E88E5'
                      : iconPreset === 'solar'
                      ? 'linear-gradient(145deg,#38BDF8,#2563EB)'
                      : 'linear-gradient(135deg,#0EA5E9 0%,#2563EB 52%,#7C3AED 100%)',
                  border:
                    iconPreset === 'ios_clean'
                      ? 'none'
                      : iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '1px solid #E2E8F0'
                      : '1px solid #4338CA',
                  boxShadow:
                    iconPreset === 'ios_clean'
                      ? '0 3px 8px rgba(37,99,235,0.25)'
                      : iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? 'none'
                      : 'inset 0 1px 1px rgba(255,255,255,0.45), 0 4px 10px rgba(79,70,229,0.32)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DuotoneIcon name="flash" size={22} active stylePreset={iconPreset} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
                  MRMS Mart AutoPay
                </div>
                <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>
                  24/7 Instant bKash & Nagad SMS Verifier
                </div>
              </div>
            </div>
            <span
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                color: '#334155',
                fontSize: 10,
                fontWeight: 800,
                padding: '4px 8px',
                borderRadius: 7,
                whiteSpace: 'nowrap',
              }}
            >
              {iconPreset.toUpperCase()}
            </span>
          </div>

          {/* 1. SERVICE CONTROL (BACKGROUND ENGINE) */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: 13,
              marginBottom: 10,
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: 9,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background:
                    iconPreset === 'ios_clean'
                      ? appServiceOn
                        ? '#10B981'
                        : '#64748B'
                      : iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke'
                      ? 'transparent'
                      : iconPreset === 'fintech_solid'
                      ? '#ECFDF5'
                      : appServiceOn
                      ? 'linear-gradient(135deg,#ECFDF5 0%,#CFFAFE 100%)'
                      : 'linear-gradient(135deg,#EEF2FF 0%,#F3E8FF 100%)',
                  border:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke'
                      ? 'none'
                      : appServiceOn
                      ? '1px solid #A7F3D0'
                      : '1px solid #DDD6FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DuotoneIcon name="shield" size={20} active={appServiceOn} stylePreset={iconPreset} />
              </div>
              <span>1. Service Control (Background Engine)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <div
                style={{
                  flex: 1,
                  padding: '6px 9px',
                  borderRadius: 9,
                  fontSize: 10.5,
                  fontWeight: 800,
                  background: appServiceOn ? '#ECFDF5' : '#FFF1F2',
                  border: appServiceOn ? '1px solid #A7F3D0' : '1px solid #FECDD3',
                  color: appServiceOn ? '#065F46' : '#9F1239',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: iconPreset === 'ios_clean' ? 22 : 'auto',
                    height: iconPreset === 'ios_clean' ? 22 : 'auto',
                    borderRadius: 6,
                    background: iconPreset === 'ios_clean' ? (appServiceOn ? '#10B981' : '#E11D48') : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DuotoneIcon
                    name="radar"
                    size={16}
                    primaryColor={appServiceOn ? '#059669' : '#E11D48'}
                    duoColor={appServiceOn ? '#06B6D4' : '#FB7185'}
                    active={appServiceOn}
                    stylePreset={iconPreset}
                  />
                </div>
                <span>{appServiceOn ? 'RUNNING (24/7 ACTIVE)' : 'SERVICE STOPPED'}</span>
              </div>
              <div
                style={{
                  padding: '6px 9px',
                  borderRadius: 9,
                  fontSize: 10.5,
                  fontWeight: 800,
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <div
                  style={{
                    width: iconPreset === 'ios_clean' ? 22 : 'auto',
                    height: iconPreset === 'ios_clean' ? 22 : 'auto',
                    borderRadius: 6,
                    background: iconPreset === 'ios_clean' ? '#F59E0B' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DuotoneIcon name="battery" size={16} active={appNeverSleep} stylePreset={iconPreset} />
                </div>
                <span>{appNeverSleep ? 'Never-Sleep: ON' : 'Tap Keep Alive'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !appServiceOn;
                setAppServiceOn(next);
                const now = new Date().toTimeString().split(' ')[0];
                setAppLogs((prev) => [
                  `[${now}] ${next ? '[ACTIVE] Service STARTED (24/7 Auto-Sync Active).' : '[STOPPED] Service STOPPED by user.'}`,
                  ...prev,
                ]);
                showToast(next ? 'Background Auto-Pay Service Started!' : 'Background Service Stopped.');
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: appServiceOn ? '1px solid #E11D48' : '1px solid #059669',
                background:
                  iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid' || iconPreset === 'flatcolor'
                    ? appServiceOn
                      ? '#E11D48'
                      : '#10B981'
                    : appServiceOn
                    ? 'linear-gradient(135deg,#FB7185 0%,#E11D48 52%,#BE123C 100%)'
                    : 'linear-gradient(135deg,#34D399 0%,#10B981 48%,#0D9488 100%)',
                boxShadow:
                  iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke'
                    ? 'none'
                    : appServiceOn
                    ? '0 3px 10px rgba(225,29,72,0.22)'
                    : '0 3px 10px rgba(16,185,129,0.22)',
                color: '#FFFFFF',
                fontSize: 12.2,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
              }}
            >
              <DuotoneIcon name={appServiceOn ? 'stop' : 'play'} size={18} stylePreset={iconPreset} />
              <span>{appServiceOn ? 'STOP AUTO-PAY SERVICE' : 'START 24/7 AUTO-PAY SERVICE'}</span>
            </button>

            <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
              <button
                onClick={() => {
                  setAppNeverSleep(true);
                  showToast('Already locked in 24/7 Never-Sleep mode!');
                }}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 9,
                  border:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '1px solid #E2E8F0'
                      : iconPreset === 'solar'
                      ? '1px solid #93C5FD'
                      : '1px solid #FCD34D',
                  background:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '#F8FAFC'
                      : iconPreset === 'flatcolor'
                      ? '#FFF8E1'
                      : iconPreset === 'solar'
                      ? '#EFF6FF'
                      : 'linear-gradient(180deg,#FFFBEB 0%,#FEF3C7 100%)',
                  color:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '#0F172A'
                      : iconPreset === 'solar'
                      ? '#1D4ED8'
                      : '#B45309',
                  fontSize: 11.8,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: iconPreset === 'ios_clean' ? 22 : 'auto',
                    height: iconPreset === 'ios_clean' ? 22 : 'auto',
                    borderRadius: 6,
                    background: iconPreset === 'ios_clean' ? '#F59E0B' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DuotoneIcon name="battery" size={16} active stylePreset={iconPreset} />
                </div>
                <span>Keep Alive (24/7)</span>
              </button>
              <button
                onClick={() => {
                  setAppSyncSpinCount((c) => c + 1);
                  const now = new Date().toTimeString().split(' ')[0];
                  setAppLogs((prev) => [
                    `[${now}] [OK] Synced 3 SMS (New: 0, Approved: 0)`,
                    `[${now}] [SYNC] Manual Inbox Sync triggered...`,
                    ...prev,
                  ]);
                  handleSimulateBackgroundAutoMatch();
                }}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  borderRadius: 9,
                  border:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '1px solid #CBD5E1'
                      : '1px solid #A5B4FC',
                  background:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '#F8FAFC'
                      : iconPreset === 'flatcolor'
                      ? '#E3F2FD'
                      : 'linear-gradient(180deg,#EEF2FF 0%,#E0E7FF 100%)',
                  color:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '#1E293B'
                      : '#4338CA',
                  fontSize: 11.8,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: iconPreset === 'ios_clean' ? 22 : 'auto',
                    height: iconPreset === 'ios_clean' ? 22 : 'auto',
                    borderRadius: 6,
                    background: iconPreset === 'ios_clean' ? '#2563EB' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DuotoneIcon name="sync" size={16} spinTrigger={appSyncSpinCount} stylePreset={iconPreset} />
                </div>
                <span>Sync Inbox Now</span>
              </button>
            </div>
          </div>

          {/* 2. WEBSITE AUTO-CONNECT */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: 13,
              marginBottom: 10,
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background:
                      iconPreset === 'ios_clean'
                        ? '#7C3AED'
                        : iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke'
                        ? 'transparent'
                        : iconPreset === 'fintech_solid'
                        ? '#F3E8FF'
                        : 'linear-gradient(135deg,#E0F2FE 0%,#F3E8FF 100%)',
                    border:
                      iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke'
                        ? 'none'
                        : '1px solid #C4B5FD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <DuotoneIcon name="link" size={19} stylePreset={iconPreset} />
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A' }}>
                    2. Website Auto-Connect (Zero Setup)
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#059669',
                      marginTop: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <div
                      style={{
                        width: iconPreset === 'ios_clean' ? 18 : 'auto',
                        height: iconPreset === 'ios_clean' ? 18 : 'auto',
                        borderRadius: 5,
                        background: iconPreset === 'ios_clean' ? '#10B981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DuotoneIcon name="check_badge" size={14} active stylePreset={iconPreset} />
                    </div>
                    <span>
                      Auto-Connected:{' '}
                      {(() => {
                        try {
                          return new URL(appSyncUrl).host || 'mrmsmart.bdz1.top';
                        } catch {
                          return 'mrmsmart.bdz1.top';
                        }
                      })()}{' '}
                      (Ready)
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAppCustomOpen((prev) => !prev)}
                style={{
                  background:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '#F8FAFC'
                      : 'linear-gradient(180deg,#FAF5FF 0%,#F3E8FF 100%)',
                  border:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '1px solid #CBD5E1'
                      : '1px solid #D8B4FE',
                  color:
                    iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                      ? '#334155'
                      : '#7E22CE',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '6px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: iconPreset === 'ios_clean' ? 20 : 'auto',
                    height: iconPreset === 'ios_clean' ? 20 : 'auto',
                    borderRadius: 5,
                    background: iconPreset === 'ios_clean' ? '#64748B' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DuotoneIcon name="sliders" size={14} stylePreset={iconPreset} />
                </div>
                <span>{appCustomOpen ? 'Hide' : 'Configure'}</span>
              </button>
            </div>

            {appCustomOpen && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => {
                    const now = new Date().toTimeString().split(' ')[0];
                    setAppLogs((prev) => [`[${now}] [OK] 1-Click Setup Code Applied & Saved.`, ...prev]);
                    showToast('1-Click Setup Applied!');
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 9,
                    border: '1px solid #2563EB',
                    background:
                      iconPreset === 'ios_clean' || iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke' || iconPreset === 'fintech_solid'
                        ? '#2563EB'
                        : 'linear-gradient(135deg,#2563EB 0%,#4F46E5 50%,#7C3AED 100%)',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 800,
                    marginBottom: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <DuotoneIcon name="copy" size={17} stylePreset={iconPreset} />
                  <span>Paste 1-Click Setup from Admin Panel</span>
                </button>
                <div className="mrms-fg">
                  <label>Website SMS Sync API URL:</label>
                  <input
                    type="text"
                    className="mono"
                    value={appSyncUrl}
                    onChange={(e) => setAppSyncUrl(e.target.value)}
                  />
                </div>
                <div className="mrms-fg">
                  <label>SMS Sync Secret Key:</label>
                  <input
                    type="text"
                    className="mono"
                    value={appSyncSecret}
                    onChange={(e) => setAppSyncSecret(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => {
                      setAppCustomOpen(false);
                      showToast('Settings Saved Successfully!');
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: 9,
                      border: '1px solid #0F172A',
                      background: '#0F172A',
                      color: '#fff',
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <DuotoneIcon name="save" size={16} stylePreset={iconPreset} />
                    <span>Save Setup</span>
                  </button>
                  <button
                    onClick={() => {
                      setAppSyncUrl('https://mrmsmart.bdz1.top/api.php?action=own_sms_sync');
                      setAppSyncSecret('mrms_sms_998877');
                      setAppCustomOpen(false);
                      showToast('Reset to Default Auto-Connect!');
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: 9,
                      border: '1px solid #FECDD3',
                      background: '#FFF1F2',
                      color: '#BE123C',
                      fontSize: 11.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <DuotoneIcon name="reset" size={16} stylePreset={iconPreset} />
                    <span>Reset Default</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. LIVE BACKGROUND ACTIVITY LOG */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: 13,
              marginBottom: 10,
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background:
                      iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke'
                        ? 'transparent'
                        : iconPreset === 'fintech_solid'
                        ? '#F1F5F9'
                        : '#0F172A',
                    border:
                      iconPreset === 'pastel_dot' || iconPreset === 'dual_stroke'
                        ? 'none'
                        : iconPreset === 'fintech_solid'
                        ? '1px solid #CBD5E1'
                        : '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DuotoneIcon name="terminal" size={19} active stylePreset={iconPreset} />
                </div>
                <span>3. Live Background Activity Log</span>
              </div>
              <button
                onClick={() => setAppLogs(['Logs cleared.'])}
                style={{
                  background: 'linear-gradient(180deg,#FFF1F2 0%,#FFE4E6 100%)',
                  border: '1px solid #FECDD3',
                  color: '#E11D48',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 11px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>

            <div
              className="mono"
              style={{
                background: 'linear-gradient(180deg,#0F172A 0%,#1E1B4B 100%)',
                color: '#38BDF8',
                borderRadius: 10,
                padding: 11,
                fontSize: 11,
                lineHeight: 1.55,
                minHeight: 155,
                whiteSpace: 'pre-wrap',
                border: '1px solid #312E81',
              }}
            >
              {appLogs.join('\n')}
            </div>
          </div>

          <a
            href="/MRMS_AutoPay.apk"
            download="MRMS_AutoPay.apk"
            className="mrms-btn"
            style={{
              width: '100%',
              padding: 11,
              textDecoration: 'none',
              fontSize: 12.5,
              borderRadius: 11,
              border: '1px solid #047857',
              background: 'linear-gradient(135deg,#10B981 0%,#059669 52%,#0D9488 100%)',
              color: '#FFFFFF',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 6px 16px rgba(16,185,129,0.32)',
            }}
          >
            <i className="ri-android-fill"></i> Download Updated MRMS_AutoPay.apk (v2.1 Color)
          </a>
        </main>
      )}

      {/* =====================================================================
          MODALS (BULK BUY, ORDER DELIVERY, AUTH, ADMIN BALANCE)
         ===================================================================== */}

      {/* BULK BUY POPUP MODAL */}
      {buyModalProd && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 410,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
            }}
          >
            <div
              style={{
                padding: '11px 14px',
                background: 'linear-gradient(135deg,var(--primary-light),#fff)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--primary-dark)' }}>
                <i className="ri-shopping-bag-3-line"></i> {buyModalProd.name}
              </h3>
              <button className="mrms-btn mrms-btn-ghost" onClick={() => setBuyModalProd(null)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div style={{ padding: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                  background: 'var(--surface-alt)',
                  padding: '8px 11px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>UNIT PRICE</div>
                  <div className="mono" style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--primary)' }}>
                    {settings.currency}
                    {buyModalProd.price.toFixed(2)} / pc
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>AVAILABLE STOCK</div>
                  <span className="mrms-badge mrms-b-ok">{buyModalProd.stockLines.length} pcs available</span>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: 'var(--primary-dark)',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  <i className="ri-information-line"></i> Product Requirements & Details
                </div>
                <div
                  style={{
                    background: 'var(--primary-light)',
                    border: '1px solid var(--primary-border)',
                    borderRadius: 10,
                    padding: '10px 12px',
                    fontSize: 11.5,
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {buyModalProd.full_description || buyModalProd.description}
                </div>
              </div>

              <div className="mrms-fg" style={{ marginBottom: 12 }}>
                <label style={{ textAlign: 'center', marginBottom: 6 }}>Select or Type Quantity to Buy</label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="mrms-btn mrms-btn-outline"
                    style={{ width: 38, height: 36, fontSize: 16 }}
                    onClick={() => setBuyQty((q) => Math.max(1, q - 1))}
                  >
                    <i className="ri-subtract-line"></i>
                  </button>
                  <input
                    type="number"
                    value={buyQty}
                    min={1}
                    max={buyModalProd.stockLines.length}
                    onChange={(e) =>
                      setBuyQty(
                        Math.max(1, Math.min(buyModalProd.stockLines.length, parseInt(e.target.value, 10) || 1))
                      )
                    }
                    className="mono"
                    style={{
                      width: 110,
                      height: 36,
                      textAlign: 'center',
                      fontSize: 15,
                      fontWeight: 800,
                      borderRadius: 10,
                      border: '1.5px solid var(--primary)',
                      color: 'var(--primary-dark)',
                    }}
                  />
                  <button
                    type="button"
                    className="mrms-btn mrms-btn-outline"
                    style={{ width: 38, height: 36, fontSize: 16 }}
                    onClick={() => setBuyQty((q) => Math.min(buyModalProd.stockLines.length, q + 1))}
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#0f172a',
                  color: '#fff',
                  padding: '10px 13px',
                  borderRadius: 10,
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8' }}>Total Payable:</span>
                <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>
                  {settings.currency}
                  {(buyQty * buyModalProd.price).toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="mrms-btn mrms-btn-ghost"
                  style={{ flex: 1, padding: 9 }}
                  onClick={() => setBuyModalProd(null)}
                >
                  <i className="ri-close-line"></i> Cancel
                </button>
                <button
                  className="mrms-btn mrms-btn-primary"
                  style={{ flex: 2, padding: 9 }}
                  onClick={handleConfirmPurchase}
                >
                  <i className="ri-check-double-line"></i> Confirm & Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERED ACCOUNTS MODAL */}
      {deliveryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 460,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
            }}
          >
            <div
              style={{
                padding: '11px 14px',
                background: 'linear-gradient(135deg,var(--primary-light),#fff)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--primary-dark)' }}>
                <i className="ri-checkbox-circle-line"></i> Delivered Accounts
              </h3>
              <button className="mrms-btn mrms-btn-ghost" onClick={() => setDeliveryModal(null)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div style={{ padding: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginBottom: 9,
                }}
              >
                <span className="mrms-badge mrms-b-blue mono">{deliveryModal.code}</span>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button
                    className="mrms-btn mrms-btn-outline"
                    onClick={() => {
                      navigator.clipboard.writeText(deliveryModal.items.join('\n'));
                      showToast('Copied all accounts!');
                    }}
                  >
                    <i className="ri-file-copy-line"></i> Copy
                  </button>
                  <button
                    className="mrms-btn mrms-btn-primary"
                    onClick={() => handleDownloadOrderFile(deliveryModal.code, deliveryModal.items, 'txt')}
                  >
                    <i className="ri-download-2-line"></i> .TXT
                  </button>
                  <button
                    className="mrms-btn mrms-btn-ghost"
                    onClick={() => handleDownloadOrderFile(deliveryModal.code, deliveryModal.items, 'csv')}
                  >
                    <i className="ri-file-excel-2-line"></i> .CSV
                  </button>
                </div>
              </div>
              <textarea
                rows={7}
                readOnly
                className="mono"
                value={deliveryModal.items.join('\n')}
                style={{
                  width: '100%',
                  padding: 9,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  fontSize: 11,
                  background: '#f8fafc',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {authModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 360,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
            }}
          >
            <div
              style={{
                padding: '11px 14px',
                background: 'linear-gradient(135deg,var(--primary-light),#fff)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--primary-dark)' }}>
                <i className="ri-shield-user-line"></i> {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </h3>
              <button className="mrms-btn mrms-btn-ghost" onClick={() => setAuthModalOpen(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 5, marginBottom: 11 }}>
                <button
                  type="button"
                  className={`mrms-btn ${authMode === 'login' ? 'mrms-btn-primary' : 'mrms-btn-ghost'}`}
                  style={{ flex: 1, padding: 7 }}
                  onClick={() => setAuthMode('login')}
                >
                  <i className="ri-login-circle-line"></i> Sign In
                </button>
                <button
                  type="button"
                  className={`mrms-btn ${authMode === 'register' ? 'mrms-btn-primary' : 'mrms-btn-ghost'}`}
                  style={{ flex: 1, padding: 7 }}
                  onClick={() => setAuthMode('register')}
                >
                  <i className="ri-user-add-line"></i> Register
                </button>
              </div>

              {/* Google Sign-In Button & Divider (Exact index.php lines 865-887) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUserId(1);
                    setAuthModalOpen(false);
                    showToast('Signed in with Google!');
                  }}
                  style={{
                    width: '100%',
                    maxWidth: 300,
                    height: 38,
                    borderRadius: 6,
                    border: '1px solid #dadce0',
                    background: '#fff',
                    color: '#3c4043',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer',
                  }}
                >
                  <i className="ri-google-fill" style={{ color: '#4285F4', fontSize: 16 }}></i>
                  <span>Continue with Google</span>
                </button>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 12,
                    color: 'var(--light)',
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
                  <span>OR CONTINUE WITH EMAIL</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--border)' }}></span>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <div className="mrms-fg">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Your Name"
                    />
                  </div>
                )}
                <div className="mrms-fg">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="mubasshir@example.com"
                  />
                </div>
                <div className="mrms-fg">
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    placeholder="Minimum 4 characters"
                  />
                </div>
                <button type="submit" className="mrms-btn mrms-btn-primary" style={{ width: '100%', padding: 8 }}>
                  <i className="ri-arrow-right-circle-line"></i> Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ADJUST BALANCE MODAL */}
      {balModalUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 340,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
            }}
          >
            <div
              style={{
                padding: '11px 14px',
                background: 'linear-gradient(135deg,var(--primary-light),#fff)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--primary-dark)' }}>
                <i className="ri-coins-line"></i> Adjust User Balance
              </h3>
              <button className="mrms-btn mrms-btn-ghost" onClick={() => setBalModalUser(null)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                User: <b style={{ color: 'var(--text)' }}>{balModalUser.name}</b>
              </div>
              <div className="mrms-fg">
                <label>Amount (Use + to Add or - to Deduct)</label>
                <input
                  type="number"
                  step="0.01"
                  value={balAdjustAmount}
                  onChange={(e) => setBalAdjustAmount(e.target.value)}
                  placeholder="e.g. 100 or -50"
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  className="mrms-btn mrms-btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setBalModalUser(null)}
                >
                  Cancel
                </button>
                <button
                  className="mrms-btn mrms-btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const delta = parseFloat(balAdjustAmount) || 0;
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === balModalUser.id
                          ? { ...u, balance: Math.max(0, Number((u.balance + delta).toFixed(2))) }
                          : u
                      )
                    );
                    setBalModalUser(null);
                    showToast('User balance updated!');
                  }}
                >
                  <i className="ri-check-line"></i> Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SCREENSHOT PROOF MODAL */}
      {screenPreviewDep && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 310,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 380,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div
              style={{
                padding: '11px 14px',
                background: 'linear-gradient(135deg,var(--primary-light),#fff)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--primary-dark)' }}>
                <i className="ri-image-line"></i> Payment Screenshot Proof
              </h3>
              <button className="mrms-btn mrms-btn-ghost" onClick={() => setScreenPreviewDep(null)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div style={{ padding: 14, textAlign: 'center' }}>
              <div
                style={{
                  background: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  borderRadius: 9,
                  padding: '8px 10px',
                  marginBottom: 10,
                  fontSize: 11.5,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span>
                    <b>Method:</b> {screenPreviewDep.method}
                  </span>
                  <span>
                    <b>Amount:</b>{' '}
                    <b style={{ color: 'var(--primary)' }}>
                      {settings.currency}
                      {screenPreviewDep.amount.toFixed(2)}
                    </b>
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    <b>Sender:</b> <span className="mono">{screenPreviewDep.sender_num}</span>
                  </span>
                  <span>
                    <b>TrxID:</b>{' '}
                    <span className="mono" style={{ fontWeight: 800 }}>
                      {screenPreviewDep.trx_id}
                    </span>
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: '#0f172a',
                  borderRadius: 10,
                  padding: 8,
                  marginBottom: 12,
                  maxHeight: 320,
                  overflow: 'auto',
                }}
              >
                <img
                  src={screenPreviewDep.screenshot}
                  alt="Payment Proof"
                  style={{ maxWidth: '100%', borderRadius: 6, display: 'block', margin: '0 auto' }}
                />
              </div>

              {screenPreviewDep.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="mrms-btn mrms-btn-success"
                    style={{ flex: 1, padding: 8 }}
                    onClick={() => {
                      const d = screenPreviewDep;
                      setDeposits((prev) =>
                        prev.map((x) => (x.id === d.id ? { ...x, status: 'approved' } : x))
                      );
                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === d.user_id
                            ? { ...u, balance: Number((u.balance + d.amount).toFixed(2)) }
                            : u
                        )
                      );
                      setScreenPreviewDep(null);
                      showToast(`Approved ${settings.currency}${d.amount} deposit!`);
                    }}
                  >
                    <i className="ri-check-line"></i> Approve Payment
                  </button>
                  <button
                    className="mrms-btn mrms-btn-danger"
                    style={{ flex: 1, padding: 8 }}
                    onClick={() => {
                      const d = screenPreviewDep;
                      setDeposits((prev) =>
                        prev.map((x) => (x.id === d.id ? { ...x, status: 'rejected' } : x))
                      );
                      setScreenPreviewDep(null);
                      showToast('Deposit rejected.');
                    }}
                  >
                    <i className="ri-close-line"></i> Reject
                  </button>
                </div>
              ) : (
                <button
                  className="mrms-btn mrms-btn-outline"
                  style={{ width: '100%', padding: 8 }}
                  onClick={() => setScreenPreviewDep(null)}
                >
                  Close Preview ({screenPreviewDep.status.toUpperCase()})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: 60,
            right: 12,
            zIndex: 600,
            background: toastMsg.isErr ? '#e11d48' : '#0f172a',
            color: '#fff',
            padding: '8px 13px',
            borderRadius: 10,
            fontSize: 11.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          }}
        >
          <i className={toastMsg.isErr ? 'ri-error-warning-line' : 'ri-checkbox-circle-line'}></i>
          <span>{toastMsg.text}</span>
        </div>
      )}
    </div>
  );
}
