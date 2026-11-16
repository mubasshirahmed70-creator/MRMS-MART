import React, { useState } from 'react';

export interface IconPresetItem {
  cls: string;
  label: string;
  tags: string;
  color: string;
  bg: string;
  border: string;
  dark: string;
}

const HUE = {
  blue: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', dark: '#1d4ed8' },
  rose: { color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', dark: '#be123c' },
  emerald: { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', dark: '#047857' },
  sky: { color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', dark: '#0369a1' },
  violet: { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', dark: '#6d28d9' },
  indigo: { color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', dark: '#4338ca' },
  amber: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', dark: '#b45309' },
  teal: { color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', dark: '#0f766e' },
};

export const CATEGORY_ICON_PRESETS: IconPresetItem[] = [
  { cls: 'ri-mail-fill', label: 'Mail', tags: 'hotmail outlook email mail inbox', ...HUE.blue },
  { cls: 'ri-mail-open-fill', label: 'Mail Open', tags: 'otp inbox read mail verify', ...HUE.sky },
  { cls: 'ri-microsoft-fill', label: 'Microsoft', tags: 'outlook hotmail office windows 365', ...HUE.blue },
  { cls: 'ri-google-fill', label: 'Google / Gmail', tags: 'gmail google workspace', ...HUE.rose },
  { cls: 'ri-facebook-circle-fill', label: 'Facebook', tags: 'fb facebook meta social ads', ...HUE.blue },
  { cls: 'ri-instagram-fill', label: 'Instagram', tags: 'ig instagram insta meta social', ...HUE.rose },
  { cls: 'ri-twitter-x-fill', label: 'X / Twitter', tags: 'twitter x social tweet', ...HUE.indigo },
  { cls: 'ri-tiktok-fill', label: 'TikTok', tags: 'tiktok video social short', ...HUE.violet },
  { cls: 'ri-youtube-fill', label: 'YouTube', tags: 'youtube yt video premium', ...HUE.rose },
  { cls: 'ri-telegram-fill', label: 'Telegram', tags: 'telegram tg bot channel', ...HUE.sky },
  { cls: 'ri-whatsapp-fill', label: 'WhatsApp', tags: 'whatsapp wa chat business', ...HUE.emerald },
  { cls: 'ri-discord-fill', label: 'Discord', tags: 'discord nitro gaming token', ...HUE.indigo },
  { cls: 'ri-linkedin-box-fill', label: 'LinkedIn', tags: 'linkedin job business profile', ...HUE.blue },
  { cls: 'ri-snapchat-fill', label: 'Snapchat', tags: 'snapchat snap social', ...HUE.amber },
  { cls: 'ri-reddit-fill', label: 'Reddit', tags: 'reddit forum karma', ...HUE.rose },
  { cls: 'ri-pinterest-fill', label: 'Pinterest', tags: 'pinterest pin design', ...HUE.rose },
  { cls: 'ri-twitch-fill', label: 'Twitch', tags: 'twitch stream gaming', ...HUE.violet },
  { cls: 'ri-global-fill', label: 'Proxy / VPN', tags: 'proxy vpn network globe ip residential', ...HUE.sky },
  { cls: 'ri-shield-keyhole-fill', label: 'Security / 2FA', tags: 'shield security 2fa auth verify', ...HUE.teal },
  { cls: 'ri-server-fill', label: 'RDP / VPS', tags: 'rdp vps server cloud hosting', ...HUE.indigo },
  { cls: 'ri-cloud-fill', label: 'Cloud', tags: 'cloud aws azure gcp storage', ...HUE.sky },
  { cls: 'ri-terminal-box-fill', label: 'API / Dev', tags: 'api code terminal script dev', ...HUE.teal },
  { cls: 'ri-github-fill', label: 'GitHub', tags: 'github git developer student', ...HUE.indigo },
  { cls: 'ri-apple-fill', label: 'Apple / iOS', tags: 'apple icloud ios mac appstore', ...HUE.indigo },
  { cls: 'ri-android-fill', label: 'Android', tags: 'android play mobile apk', ...HUE.emerald },
  { cls: 'ri-windows-fill', label: 'Windows', tags: 'windows license key os', ...HUE.blue },
  { cls: 'ri-netflix-fill', label: 'Netflix', tags: 'netflix ott movie stream', ...HUE.rose },
  { cls: 'ri-spotify-fill', label: 'Spotify', tags: 'spotify music audio stream', ...HUE.emerald },
  { cls: 'ri-amazon-fill', label: 'Amazon', tags: 'amazon prime aws shopping', ...HUE.amber },
  { cls: 'ri-paypal-fill', label: 'PayPal', tags: 'paypal payment wallet finance', ...HUE.blue },
  { cls: 'ri-steam-fill', label: 'Steam', tags: 'steam gaming pc key', ...HUE.indigo },
  { cls: 'ri-gamepad-fill', label: 'Gaming', tags: 'game xbox psn pubg freefire', ...HUE.violet },
  { cls: 'ri-vip-crown-fill', label: 'VIP / Pro', tags: 'vip crown premium pro gold', ...HUE.amber },
  { cls: 'ri-shopping-bag-3-fill', label: 'Store Item', tags: 'shop bag product digital', ...HUE.teal },
  { cls: 'ri-key-2-fill', label: 'License Key', tags: 'key serial activation license', ...HUE.amber },
  { cls: 'ri-bank-card-fill', label: 'Card / VCC', tags: 'vcc card bank billing payment', ...HUE.emerald },
];

export function isImageIcon(icon?: string): boolean {
  if (!icon) return false;
  const val = icon.trim();
  return (
    val.startsWith('http://') ||
    val.startsWith('https://') ||
    val.startsWith('data:image/') ||
    val.startsWith('/')
  );
}

export function renderCategoryIconGlyph(
  icon: string,
  size = 16,
  color?: string,
  preferFill = true
): React.ReactNode {
  const clean = (icon || '').trim();
  if (isImageIcon(clean)) {
    return (
      <img
        src={clean}
        alt=""
        style={{
          width: size + 2,
          height: size + 2,
          objectFit: 'contain',
          borderRadius: 4,
          display: 'block',
        }}
      />
    );
  }
  const cls = clean.startsWith('ri-')
    ? preferFill
      ? clean.replace('-line', '-fill')
      : clean
    : 'ri-apps-2-fill';
  return <i className={cls} style={{ fontSize: size, color, lineHeight: 1 }} />;
}

interface CategoryIconPickerProps {
  value: string;
  onChange: (nextValue: string) => void;
  previewName?: string;
  allowCategoryDefault?: boolean;
  defaultIcon?: string;
  defaultLabel?: string;
}

export const CategoryIconPicker: React.FC<CategoryIconPickerProps> = ({
  value,
  onChange,
  previewName = 'Category',
  allowCategoryDefault = false,
  defaultIcon = 'ri-apps-2-fill',
  defaultLabel = 'Category Icon',
}) => {
  const effectivePreviewVal = value.trim() || (allowCategoryDefault ? defaultIcon : 'ri-mail-fill');
  const isUsingDefault = allowCategoryDefault && value.trim() === '';

  const initialMode: 'grid' | 'custom' | 'image' = isImageIcon(value)
    ? 'image'
    : !value.trim() ||
      CATEGORY_ICON_PRESETS.some(
        (p) => p.cls === value || p.cls === value.replace('-line', '-fill')
      )
    ? 'grid'
    : 'custom';

  const [mode, setMode] = useState<'grid' | 'custom' | 'image'>(initialMode);
  const [search, setSearch] = useState('');

  const filteredPresets = CATEGORY_ICON_PRESETS.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.cls.toLowerCase().includes(q) ||
      item.tags.toLowerCase().includes(q)
    );
  });

  const activePreset =
    CATEGORY_ICON_PRESETS.find(
      (p) =>
        p.cls === effectivePreviewVal ||
        p.cls === effectivePreviewVal.replace('-line', '-fill')
    ) || HUE.violet;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      if (file.type === 'image/svg+xml' || reader.result.length < 12000) {
        onChange(reader.result);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const maxDim = 96;
        const scale = Math.min(1, maxDim / Math.max(img.width || maxDim, img.height || maxDim));
        const w = Math.max(1, Math.round((img.width || maxDim) * scale));
        const h = Math.max(1, Math.round((img.height || maxDim) * scale));
        const cvs = document.createElement('canvas');
        cvs.width = w;
        cvs.height = h;
        cvs.getContext('2d')?.drawImage(img, 0, 0, w, h);
        onChange(cvs.toDataURL('image/png'));
      };
      img.onerror = () => onChange(String(reader.result));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 10,
      }}
    >
      {allowCategoryDefault && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '6px 9px',
            marginBottom: 8,
            borderRadius: 9,
            background: isUsingDefault ? '#eff6ff' : '#f5f3ff',
            border: isUsingDefault ? '1px solid #bfdbfe' : '1px solid #ddd6fe',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 700, color: isUsingDefault ? '#1d4ed8' : '#6d28d9' }}>
            {renderCategoryIconGlyph(effectivePreviewVal, 14, isUsingDefault ? '#2563eb' : '#7c3aed')}
            <span>
              {isUsingDefault
                ? `Default: Using ${defaultLabel}`
                : 'Custom Product Icon Active'}
            </span>
          </div>
          {!isUsingDefault && (
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                padding: '3px 8px',
                borderRadius: 7,
                border: '1px solid #bfdbfe',
                background: '#ffffff',
                color: '#2563eb',
                fontSize: 10,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              ↺ Use Category Icon
            </button>
          )}
        </div>
      )}
      {/* 3-Tab Mode Switcher (Style 4 Pills) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 5,
          marginBottom: 9,
          background: '#ffffff',
          padding: 4,
          borderRadius: 10,
          border: '1px solid #e2e8f0',
        }}
      >
        {[
          { id: 'grid', label: 'Icon Grid', icon: 'ri-apps-2-fill' },
          { id: 'custom', label: 'Icon Name', icon: 'ri-code-box-fill' },
          { id: 'image', label: 'Logo / Image', icon: 'ri-image-add-fill' },
        ].map((tab) => {
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id as 'grid' | 'custom' | 'image')}
              style={{
                padding: '6px 6px',
                borderRadius: 7,
                border: active ? '1px solid #1d4ed8' : '1px solid transparent',
                background: active ? '#2563eb' : 'transparent',
                color: active ? '#ffffff' : '#475569',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                transition: 'all 0.16s ease',
              }}
            >
              <i className={tab.icon} style={{ fontSize: 13 }}></i>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode 1: Multi-Color Pastel-to-Solid Icon Grid */}
      {mode === 'grid' && (
        <div>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <i
              className="ri-search-line"
              style={{
                position: 'absolute',
                left: 9,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: 13,
              }}
            ></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icon (e.g. facebook, gmail, netflix, vpn)..."
              style={{ paddingLeft: 28, fontSize: 11.5 }}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 6,
              maxHeight: 174,
              overflowY: 'auto',
              padding: 2,
            }}
          >
            {filteredPresets.map((item) => {
              const selected =
                value === item.cls || value.replace('-line', '-fill') === item.cls;
              return (
                <button
                  key={item.cls}
                  type="button"
                  title={item.label}
                  onClick={() => onChange(item.cls)}
                  style={{
                    height: 40,
                    borderRadius: 10,
                    border: selected ? `1px solid ${item.dark}` : `1px solid ${item.border}`,
                    background: selected ? item.color : item.bg,
                    color: selected ? '#ffffff' : item.color,
                    boxShadow: selected ? `0 4px 10px ${item.color}3d` : 'none',
                    transform: selected ? 'translateY(-1.5px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <i className={item.cls} style={{ fontSize: 18 }}></i>
                </button>
              );
            })}
            {filteredPresets.length === 0 && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '14px 8px',
                  fontSize: 11,
                  color: '#64748b',
                }}
              >
                No preset found — switch to <b>Icon Name</b> or <b>Logo / Image</b>!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Any RemixIcon Name (2,800+ Icons) */}
      {mode === 'custom' && (
        <div>
          <div
            style={{
              fontSize: 10.5,
              color: '#475569',
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              borderRadius: 8,
              padding: '6px 8px',
              marginBottom: 7,
              lineHeight: 1.4,
            }}
          >
            <b style={{ color: '#4f46e5' }}>RemixIcon (2,800+ Icons):</b> Paste any icon code name
            from <b>remixicon.com</b> (like <code className="mono">ri-threads-fill</code>) to use it
            instantly.
          </div>
          <input
            type="text"
            className="mono"
            value={isImageIcon(value) ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. ri-threads-fill, ri-openai-fill, ri-shopping-cart-2-fill"
            style={{ fontSize: 11.5, marginBottom: 7 }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              'ri-threads-fill',
              'ri-openai-fill',
              'ri-wechat-fill',
              'ri-messenger-fill',
              'ri-spotify-fill',
              'ri-flashlight-fill',
            ].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => onChange(sample)}
                style={{
                  padding: '3px 7px',
                  borderRadius: 7,
                  border: value === sample ? '1px solid #6d28d9' : '1px solid #ddd6fe',
                  background: value === sample ? '#7c3aed' : '#f5f3ff',
                  color: value === sample ? '#ffffff' : '#7c3aed',
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <i className={sample}></i> {sample.replace('ri-', '').replace('-fill', '')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Custom Image / PNG / SVG Logo Upload or URL */}
      {mode === 'image' && (
        <div>
          <input
            type="text"
            value={isImageIcon(value) ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste PNG / SVG / JPG logo URL (https://...)"
            style={{ fontSize: 11.5, marginBottom: 7 }}
          />
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '7px 10px',
              borderRadius: 9,
              border: '1px dashed #93c5fd',
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'none',
              marginBottom: 0,
            }}
          >
            <i className="ri-upload-2-fill" style={{ fontSize: 14 }}></i>
            <span>Or Upload Custom Logo File (PNG / SVG / JPG)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}

      {/* Live Storefront Preview Strip */}
      <div
        style={{
          marginTop: 9,
          padding: '7px 9px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
          Live Preview
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              padding: '4px 9px',
              borderRadius: 8,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#1e293b',
              fontSize: 11,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {renderCategoryIconGlyph(effectivePreviewVal, 13, activePreset.color)}
            <span>{previewName.trim() || 'Category'}</span>
          </span>
          <div
            title="Product Card Icon Box Preview"
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: activePreset.bg,
              border: `1px solid ${activePreset.border}`,
              color: activePreset.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {renderCategoryIconGlyph(effectivePreviewVal, 15, activePreset.color)}
          </div>
        </div>
      </div>
    </div>
  );
};
