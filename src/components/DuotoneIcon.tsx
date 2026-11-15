import React, { useId } from 'react';

export type DuotoneIconName =
  | 'flash'
  | 'shield'
  | 'radar'
  | 'battery'
  | 'sync'
  | 'link'
  | 'check_badge'
  | 'sliders'
  | 'terminal'
  | 'play'
  | 'stop'
  | 'copy'
  | 'save'
  | 'reset';

export type IconStylePreset =
  | 'ios_clean'
  | 'pastel_dot'
  | 'dual_stroke'
  | 'fintech_solid'
  | 'fluent3d'
  | 'flatcolor'
  | 'lordicon'
  | 'solar'
  | 'stripe';

interface DuotoneIconProps {
  name: DuotoneIconName;
  size?: number;
  primaryColor?: string;
  duoColor?: string;
  active?: boolean;
  spinTrigger?: number;
  stylePreset?: IconStylePreset;
}

export const DuotoneIcon: React.FC<DuotoneIconProps> = ({
  name,
  size = 20,
  primaryColor,
  duoColor,
  active = false,
  spinTrigger = 0,
  stylePreset = 'ios_clean',
}) => {
  const uid = useId().replace(/:/g, '');

  // =========================================================================
  // STYLE 6 (NEW SIMPLE #1): iOS CLEAN TILE (Crisp Pure White / Clean Line)
  // =========================================================================
  if (stylePreset === 'ios_clean') {
    const fg = primaryColor || '#FFFFFF';
    switch (name) {
      case 'flash':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M13.2 3.5L6.2 12.6H11.6L10.2 20.5L17.8 11.2H12.4L13.2 3.5Z" fill={fg} />
          </svg>
        );
      case 'shield':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3.2L19 6V11.6C19 16 16 19.6 12 20.8C8 19.6 5 16 5 11.6V6L12 3.2Z"
              stroke={fg}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M8.8 12.2L11 14.4L15.4 9.8" stroke={fg} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'radar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="7.5" fill={active ? '#10B981' : '#F43F5E'} fillOpacity="0.22" />
            <circle cx="12" cy="12" r="4.2" fill={active ? '#059669' : '#E11D48'} />
          </svg>
        );
      case 'battery':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="6.5" width="16" height="11" rx="2.6" stroke={primaryColor || '#D97706'} strokeWidth="1.9" />
            <rect x="5.2" y="8.7" width="10.5" height="6.6" rx="1.3" fill={duoColor || '#10B981'} />
            <path d="M20.8 10V14" stroke={primaryColor || '#D97706'} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'sync':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <g key={spinTrigger} className={spinTrigger > 0 ? 'duo-spin-once' : undefined}>
              <path d="M18 9.5A6.5 6.5 0 0 0 6.8 7.8M6 14.5A6.5 6.5 0 0 0 17.2 16.2" stroke={primaryColor || '#2563EB'} strokeWidth="2" strokeLinecap="round" />
              <path d="M18.2 5.8V9.6H14.4M5.8 18.2V14.4H9.6" stroke={primaryColor || '#2563EB'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );
      case 'link':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              stroke={fg}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              stroke={fg}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'check_badge':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" fill="#10B981" />
            <path d="M8.3 12.2L10.8 14.7L15.8 9.6" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'sliders':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 8H20M4 16H20" stroke={primaryColor || '#475569'} strokeWidth="1.9" strokeLinecap="round" />
            <circle cx="9" cy="8" r="2.4" fill="#FFFFFF" stroke={primaryColor || '#2563EB'} strokeWidth="2" />
            <circle cx="15" cy="16" r="2.4" fill="#FFFFFF" stroke={primaryColor || '#7C3AED'} strokeWidth="2" />
          </svg>
        );
      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6.5 9L10.5 12.5L6.5 16" stroke={fg} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.5 16H17.5" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        );
      case 'play':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8.5 6.8L17.5 12L8.5 17.2V6.8Z" fill="#FFFFFF" />
          </svg>
        );
      case 'stop':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="7.5" y="7.5" width="9" height="9" rx="2" fill="#FFFFFF" />
          </svg>
        );
      case 'copy':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="8" y="4" width="11.5" height="13" rx="2.2" stroke="#FFFFFF" strokeWidth="1.9" />
            <rect x="4.5" y="7.5" width="11.5" height="13" rx="2.2" fill="#FFFFFF" fillOpacity="0.25" stroke="#FFFFFF" strokeWidth="1.9" />
          </svg>
        );
      case 'save':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" stroke="#FFFFFF" strokeWidth="1.9" />
            <path d="M8.5 12.5L11 15L15.8 9.8" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'reset':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17.8 8.6A6.5 6.5 0 1 0 18.5 13" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
            <path d="M15.2 4.8L18.2 8.4L14.2 9.4" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  }

  // =========================================================================
  // STYLE 7 (NEW SIMPLE #2): PASTEL SOFT DOT (Slim Line + Offset Color Circle)
  // =========================================================================
  if (stylePreset === 'pastel_dot') {
    switch (name) {
      case 'flash':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="14.5" cy="9.5" r="6" fill="#FDE047" fillOpacity="0.55" />
            <path d="M13 3.5L6 12.5H11.5L10 20.5L17.5 11H12L13 3.5Z" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        );
      case 'shield':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="14.5" cy="10" r="6.2" fill={active ? '#6EE7B7' : '#93C5FD'} fillOpacity="0.55" />
            <path d="M12 3.2L19 6V11.6C19 16 16 19.6 12 20.8C8 19.6 5 16 5 11.6V6L12 3.2Z" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M8.8 12.2L11 14.4L15.4 9.8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'radar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="13.5" cy="12" r="6.5" fill={active ? '#6EE7B7' : '#FDA4AF'} fillOpacity="0.6" />
            <circle cx="11" cy="12" r="4" stroke="#0F172A" strokeWidth="1.8" fill={active ? '#10B981' : '#F43F5E'} />
          </svg>
        );
      case 'battery':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="14.5" cy="13.5" r="5.8" fill="#FDE68A" />
            <rect x="6" y="5" width="12" height="15.5" rx="2.4" stroke="#0F172A" strokeWidth="1.8" />
            <path d="M10 2.5H14" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12.5 8.8L9.8 12.6H12.2L11.5 16.5L14.2 12.4H11.8L12.5 8.8Z" fill="#D97706" />
          </svg>
        );
      case 'sync':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="14.5" cy="10" r="6" fill="#C7D2FE" />
            <g key={spinTrigger} className={spinTrigger > 0 ? 'duo-spin-once' : undefined}>
              <path d="M17.8 9.5A6.2 6.2 0 0 0 7 7.8M6.2 14.5A6.2 6.2 0 0 0 17 16.2" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M18 5.8V9.6H14.2M6 18.2V14.4H9.8" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );
      case 'link':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="14.5" cy="9.5" r="6" fill="#DDD6FE" />
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );
      case 'check_badge':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="14" cy="11" r="6" fill="#A7F3D0" />
            <circle cx="12" cy="12" r="8.2" stroke="#0F172A" strokeWidth="1.8" />
            <path d="M8.5 12.2L10.8 14.5L15.6 9.6" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'sliders':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="14.5" cy="12" r="6" fill="#FBCFE8" />
            <path d="M4 8.5H20M4 15.5H20" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="9" cy="8.5" r="2.3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" />
            <circle cx="15" cy="15.5" r="2.3" fill="#EC4899" stroke="#0F172A" strokeWidth="1.8" />
          </svg>
        );
      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="15" cy="13" r="5.5" fill="#BAE6FD" />
            <rect x="3.5" y="4.5" width="17" height="15" rx="2.8" stroke="#0F172A" strokeWidth="1.8" />
            <path d="M7.5 10L10.5 12.5L7.5 15" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.5 15H16.5" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="13.5" cy="11" r="5.5" fill="#FFFFFF" fillOpacity="0.28" />
            {name === 'play' && <path d="M9.6 7.4L17.1 12L9.6 16.6V7.4Z" fill="#FFFFFF" />}
            {name === 'stop' && <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1.6" fill="#FFFFFF" />}
            {name === 'copy' && <rect x="6" y="5" width="12" height="14" rx="2" stroke="#FFFFFF" strokeWidth="1.8" />}
            {name === 'save' && <rect x="5" y="5" width="14" height="14" rx="2" stroke="#FFFFFF" strokeWidth="1.8" />}
            {name === 'reset' && <path d="M17.8 8.6A6.5 6.5 0 1 0 18.5 13" stroke="#E11D48" strokeWidth="1.9" strokeLinecap="round" />}
          </svg>
        );
    }
  }

  // =========================================================================
  // STYLE 8 (NEW SIMPLE #3): MINIMAL DUAL-STROKE (Clean Slate Line + Pop Accent)
  // =========================================================================
  if (stylePreset === 'dual_stroke') {
    switch (name) {
      case 'flash':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M13.2 3.2L5.8 12.5H11.5L9.9 20.5L17.8 10.8H12.2L13.2 3.2Z" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12.2 8.5L9.5 12.5H13.5L11.5 16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'shield':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3.2L19 6V11.6C19 16 16 19.6 12 20.8C8 19.6 5 16 5 11.6V6L12 3.2Z" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
            <path d="M8.8 12.2L11 14.4L15.5 9.6" stroke={active ? '#10B981' : '#3B82F6'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'radar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="7.5" stroke="#64748B" strokeWidth="1.8" strokeDasharray="3 2" />
            <circle cx="12" cy="12" r="3.8" fill={active ? '#10B981' : '#EF4444'} />
          </svg>
        );
      case 'battery':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="6" y="5" width="12" height="15.5" rx="2.4" stroke="#334155" strokeWidth="2" />
            <path d="M10 2.5H14" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <path d="M12.6 8.5L9.5 12.8H12.2L11.4 17L14.5 12.4H11.8L12.6 8.5Z" fill="#F59E0B" />
          </svg>
        );
      case 'sync':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <g key={spinTrigger} className={spinTrigger > 0 ? 'duo-spin-once' : undefined}>
              <path d="M18 9.4A6.5 6.5 0 0 0 7 7.6" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M18.2 5.8V9.6H14.4" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 14.6A6.5 6.5 0 0 0 17 16.4" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
              <path d="M5.8 18.2V14.4H9.6" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );
      case 'link':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'check_badge':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8.4" stroke="#334155" strokeWidth="1.9" />
            <path d="M8.3 12.2L10.8 14.7L15.9 9.5" stroke="#10B981" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'sliders':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 8.5H20M4 15.5H20" stroke="#334155" strokeWidth="1.9" strokeLinecap="round" />
            <circle cx="9" cy="8.5" r="2.4" fill="#0EA5E9" />
            <circle cx="15" cy="15.5" r="2.4" fill="#F59E0B" />
          </svg>
        );
      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.2" y="4.2" width="17.6" height="15.6" rx="2.8" stroke="#334155" strokeWidth="2" />
            <path d="M7.2 10L10.4 12.6L7.2 15.2" stroke="#0EA5E9" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.2 15.2H16.6" stroke="#10B981" strokeWidth="2.1" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {name === 'play' && <path d="M9 7L17.5 12L9 17V7Z" fill="#FFFFFF" />}
            {name === 'stop' && <rect x="8" y="8" width="8" height="8" rx="1.6" fill="#FFFFFF" />}
            {name === 'copy' && <rect x="6" y="5" width="12" height="14" rx="2" stroke="#FFFFFF" strokeWidth="1.9" />}
            {name === 'save' && <rect x="5" y="5" width="14" height="14" rx="2" stroke="#34D399" strokeWidth="1.9" />}
            {name === 'reset' && <path d="M17.8 8.6A6.5 6.5 0 1 0 18.5 13" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        );
    }
  }

  // =========================================================================
  // STYLE 9 (NEW SIMPLE #4): CLEAN SOLID PILL (bKash / Modern Fintech Solid)
  // =========================================================================
  if (stylePreset === 'fintech_solid') {
    switch (name) {
      case 'flash':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M13.4 3.2L5.8 12.6H11.5L9.8 20.8L17.8 10.8H12.2L13.4 3.2Z" fill="#FFFFFF" />
          </svg>
        );
      case 'shield':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2.8L19.2 5.8V11.6C19.2 16.3 16.1 20 12 21.3C7.9 20 4.8 16.3 4.8 11.6V5.8L12 2.8Z"
              fill={active ? '#059669' : '#2563EB'}
            />
            <path d="M8.6 12.2L11 14.5L15.6 9.6" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'radar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="5" fill={active ? '#059669' : '#E11D48'} />
          </svg>
        );
      case 'battery':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9.5" y="2.2" width="5" height="2.2" rx="1" fill="#0284C7" />
            <rect x="6" y="4.6" width="12" height="16.4" rx="2.6" fill="#0284C7" />
            <path d="M12.6 8.4L9.4 12.8H12.1L11.3 17.2L14.5 12.5H11.8L12.6 8.4Z" fill="#FFFFFF" />
          </svg>
        );
      case 'sync':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <g key={spinTrigger} className={spinTrigger > 0 ? 'duo-spin-once' : undefined}>
              <path d="M17.8 9.5A6.2 6.2 0 0 0 7 7.8M6.2 14.5A6.2 6.2 0 0 0 17 16.2" stroke="#2563EB" strokeWidth="2.3" strokeLinecap="round" />
              <path d="M18 5.8V9.6H14.2M6 18.2V14.4H9.8" stroke="#2563EB" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );
      case 'link':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.2" fill="#2563EB" />
            <path d="M9.2 14.8L14.8 9.2M8 12.5L6.8 13.7A2.5 2.5 0 0 0 10.3 17.2L11.5 16M16 11.5L17.2 10.3A2.5 2.5 0 0 0 13.7 6.8L12.5 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'check_badge':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8.8" fill="#059669" />
            <path d="M8.3 12.2L10.8 14.7L15.9 9.5" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'sliders':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 8.5H20M4 15.5H20" stroke="#2563EB" strokeWidth="2.1" strokeLinecap="round" />
            <circle cx="9" cy="8.5" r="2.6" fill="#2563EB" />
            <circle cx="15" cy="15.5" r="2.6" fill="#2563EB" />
          </svg>
        );
      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="3" fill="#0F172A" />
            <path d="M7.2 10L10.4 12.6L7.2 15.2" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.2 15.2H16.6" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {name === 'play' && <path d="M9 7L17.5 12L9 17V7Z" fill="#FFFFFF" />}
            {name === 'stop' && <rect x="8" y="8" width="8" height="8" rx="1.6" fill="#FFFFFF" />}
            {name === 'copy' && <rect x="6" y="5" width="12" height="14" rx="2" stroke="#FFFFFF" strokeWidth="2" />}
            {name === 'save' && <rect x="5" y="5" width="14" height="14" rx="2" stroke="#FFFFFF" strokeWidth="2" />}
            {name === 'reset' && <path d="M17.8 8.6A6.5 6.5 0 1 0 18.5 13" stroke="#E11D48" strokeWidth="2.1" strokeLinecap="round" />}
          </svg>
        );
    }
  }

  // =========================================================================
  // STYLE 1: MICROSOFT FLUENT 3D / SOFT GLOSSY COLOR (3D Gradients + Specular)
  // =========================================================================
  if (stylePreset === 'fluent3d') {
    switch (name) {
      case 'flash':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id={`f3d_fl_${uid}`} x1="5" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <filter id={`f3d_sh_${uid}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#B45309" floodOpacity="0.45" />
              </filter>
            </defs>
            <circle cx="12" cy="12" r="10" fill="#38BDF8" fillOpacity="0.22" className={active ? 'duo-breathe' : undefined} />
            <path
              filter={`url(#f3d_sh_${uid})`}
              d="M13.6 2.8L5.6 12.6H11.4L9.8 21.2L18.4 11H12.5L13.6 2.8Z"
              fill={`url(#f3d_fl_${uid})`}
            />
            <path
              d="M13.2 3.8L6.8 11.8H11.2L13.2 3.8Z"
              fill="#FFFFFF"
              fillOpacity="0.55"
            />
          </svg>
        );

      case 'shield':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id={`f3d_shd_${uid}`} x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={active ? '#34D399' : '#60A5FA'} />
                <stop offset="55%" stopColor={active ? '#10B981' : '#3B82F6'} />
                <stop offset="100%" stopColor={active ? '#047857' : '#1D4ED8'} />
              </linearGradient>
              <linearGradient id={`f3d_shd_in_${uid}`} x1="7" y1="5" x2="17" y2="19" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d="M12 2.4L19.8 5.6V11.6C19.8 16.6 16.4 20.4 12 21.8C7.6 20.4 4.2 16.6 4.2 11.6V5.6L12 2.4Z"
              fill={`url(#f3d_shd_${uid})`}
            />
            <path
              d="M12 3.6L18.4 6.3V11.4C18.4 15.6 15.6 18.8 12 20C8.4 18.8 5.6 15.6 5.6 11.4V6.3L12 3.6Z"
              fill={`url(#f3d_shd_in_${uid})`}
            />
            <path
              d="M8.6 12.1L11 14.5L15.6 9.6"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'radar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
              <radialGradient id={`f3d_rd_${uid}`} cx="38%" cy="35%" r="65%">
                <stop offset="0%" stopColor={active ? '#6EE7B7' : '#FDA4AF'} />
                <stop offset="55%" stopColor={active ? '#10B981' : '#F43F5E'} />
                <stop offset="100%" stopColor={active ? '#047857' : '#BE123C'} />
              </radialGradient>
            </defs>
            {active && (
              <circle cx="12" cy="12" r="5.5" fill="#10B981" fillOpacity="0.45" className="duo-radar-ring" />
            )}
            <circle cx="12" cy="12" r="8" fill={active ? '#10B981' : '#F43F5E'} fillOpacity="0.22" />
            <circle cx="12" cy="12" r="5.2" fill={`url(#f3d_rd_${uid})`} />
            <circle cx="10.3" cy="10.2" r="1.4" fill="#FFFFFF" fillOpacity="0.65" />
          </svg>
        );

      case 'battery':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id={`f3d_bat_${uid}`} x1="6" y1="4" x2="18" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>
            <rect x="9.2" y="2" width="5.6" height="2.4" rx="1.2" fill="#D97706" />
            <rect x="5.5" y="4.2" width="13" height="17.2" rx="3.2" fill={`url(#f3d_bat_${uid})`} />
            <rect x="7" y="5.6" width="4.5" height="14.4" rx="1.8" fill="#FFFFFF" fillOpacity="0.32" />
            <path d="M12.8 8.2L9.2 13H12.1L11.2 17.5L14.8 12.5H11.9L12.8 8.2Z" fill="#FFFFFF" />
          </svg>
        );

      case 'sync':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id={`f3d_sy_${uid}`} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="9.6" fill={`url(#f3d_sy_${uid})`} />
            <circle cx="12" cy="8.5" r="5.5" fill="#FFFFFF" fillOpacity="0.18" />
            <g key={spinTrigger} className={spinTrigger > 0 ? 'duo-spin-once' : undefined}>
              <path d="M16.8 9.8A5.4 5.4 0 0 0 7.6 8.2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M17 6.6V10H13.6" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.2 14.2A5.4 5.4 0 0 0 16.4 15.8" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M7 17.4V14H10.4" stroke="#FDE047" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );

      case 'link':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <g transform="rotate(-40 12 12)">
              <rect x="3" y="8" width="10.2" height="7.6" rx="3.8" fill="#0EA5E9" />
              <rect x="4.5" y="9.4" width="7.2" height="4.8" rx="2.4" fill="#E0F2FE" />
              <rect x="10.8" y="8" width="10.2" height="7.6" rx="3.8" fill="#8B5CF6" />
              <rect x="12.3" y="9.4" width="7.2" height="4.8" rx="2.4" fill="#F3E8FF" />
            </g>
          </svg>
        );

      case 'check_badge':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id={`f3d_cb_${uid}`} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="9.4" fill={`url(#f3d_cb_${uid})`} />
            <path d="M8.2 12.2L10.8 14.8L16 9.4" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'sliders':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="6" width="18" height="2.6" rx="1.3" fill="#C7D2FE" />
            <rect x="3" y="11" width="18" height="2.6" rx="1.3" fill="#FBCFE8" />
            <rect x="3" y="16" width="18" height="2.6" rx="1.3" fill="#FDE68A" />
            <circle cx="8.5" cy="7.3" r="3" fill="#4F46E5" />
            <circle cx="8.5" cy="7.3" r="1.2" fill="#FFFFFF" />
            <circle cx="15.5" cy="12.3" r="3" fill="#DB2777" />
            <circle cx="15.5" cy="12.3" r="1.2" fill="#FFFFFF" />
            <circle cx="10.5" cy="17.3" r="3" fill="#D97706" />
            <circle cx="10.5" cy="17.3" r="1.2" fill="#FFFFFF" />
          </svg>
        );

      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="3.5" width="19" height="17" rx="3.8" fill="#1E293B" />
            <path d="M2.5 7.3C2.5 5.2 4.2 3.5 6.3 3.5H17.7C19.8 3.5 21.5 5.2 21.5 7.3V8.6H2.5V7.3Z" fill="#475569" />
            <circle cx="5.8" cy="6" r="1.2" fill="#FB7185" />
            <circle cx="9" cy="6" r="1.2" fill="#FBBF24" />
            <circle cx="12.2" cy="6" r="1.2" fill="#34D399" />
            <path d="M6.8 11.8L10 14L6.8 16.2" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16.2H17" stroke="#FDE047" strokeWidth="2.3" strokeLinecap="round" className="duo-cursor-blink" />
          </svg>
        );

      case 'play':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.6" fill="#FFFFFF" fillOpacity="0.28" />
            <path d="M9.6 7.2L17.4 12L9.6 16.8V7.2Z" fill="#FEF08A" />
          </svg>
        );

      case 'stop':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.6" fill="#FFFFFF" fillOpacity="0.28" />
            <rect x="8" y="8" width="8" height="8" rx="2" fill="#FEF08A" />
          </svg>
        );

      case 'copy':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="8" y="3.5" width="12" height="13.5" rx="2.6" fill="#FDE047" />
            <rect x="4.5" y="7" width="12" height="13.5" rx="2.6" fill="#FFFFFF" />
            <rect x="6.8" y="10" width="7.4" height="1.8" rx="0.9" fill="#6366F1" />
            <rect x="6.8" y="13.5" width="5.4" height="1.8" rx="0.9" fill="#EC4899" />
          </svg>
        );

      case 'save':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="3" fill="#38BDF8" />
            <rect x="7.5" y="12.2" width="9" height="7.8" rx="1.2" fill="#FFFFFF" />
            <rect x="7.8" y="4" width="7.5" height="5" rx="1" fill="#FDE047" />
          </svg>
        );

      case 'reset':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.2" fill="#FDA4AF" fillOpacity="0.35" />
            <path d="M17.8 8.6A6.5 6.5 0 1 0 18.5 13" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M15.2 4.8L18.2 8.4L14.2 9.4" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  }

  // =========================================================================
  // STYLE 2: FLAT MULTI-COLOR ICONS (Solid Vivid Flat Palette, Crisp Shapes)
  // =========================================================================
  if (stylePreset === 'flatcolor') {
    switch (name) {
      case 'flash':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#FFC107" />
            <path d="M13.5 4L6.5 13H11.8L10.4 20L17.5 11H12.2L13.5 4Z" fill="#FFF8E1" />
          </svg>
        );
      case 'shield':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2.5L19.5 5.7V11.5C19.5 16.5 16.3 20.2 12 21.6V2.5Z" fill={active ? '#00C853' : '#1E88E5'} />
            <path d="M12 2.5L4.5 5.7V11.5C4.5 16.5 7.7 20.2 12 21.6V2.5Z" fill={active ? '#69F0AE' : '#64B5F6'} />
            <path d="M8.5 12.2L11 14.7L15.8 9.6" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'radar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" fill={active ? '#B9F6CA' : '#FFCDD2'} />
            <circle cx="12" cy="12" r="5" fill={active ? '#00C853' : '#E53935'} />
          </svg>
        );
      case 'battery':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9" y="2" width="6" height="2.5" rx="1" fill="#78909C" />
            <rect x="5.5" y="4.5" width="13" height="17" rx="2.6" fill="#FF9800" />
            <rect x="7.2" y="10" width="9.6" height="9.8" rx="1.5" fill="#4CAF50" />
            <path d="M12.6 7.5L9.4 12.4H12L11.2 16.8L14.6 11.8H12L12.6 7.5Z" fill="#FFEB3B" />
          </svg>
        );
      case 'sync':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" fill="#E3F2FD" />
            <g key={spinTrigger} className={spinTrigger > 0 ? 'duo-spin-once' : undefined}>
              <path d="M17.5 9.5A6 6 0 0 0 7 7.8" stroke="#1E88E5" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M17.8 5.8V9.8H13.8" stroke="#1E88E5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6.5 14.5A6 6 0 0 0 17 16.2" stroke="#FF7043" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M6.2 18.2V14.2H10.2" stroke="#FF7043" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );
      case 'link':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <g transform="rotate(-40 12 12)">
              <rect x="3.2" y="8.4" width="9.8" height="7" rx="3.5" stroke="#00ACC1" strokeWidth="2.5" fill="#E0F7FA" />
              <rect x="11" y="8.4" width="9.8" height="7" rx="3.5" stroke="#FB8C00" strokeWidth="2.5" fill="#FFF3E0" />
            </g>
          </svg>
        );
      case 'check_badge':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" fill="#00C853" />
            <path d="M8 12.2L10.8 15L16.2 9.4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'sliders':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7H20" stroke="#90A4AE" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M4 12H20" stroke="#90A4AE" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M4 17H20" stroke="#90A4AE" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="8.5" cy="7" r="2.8" fill="#1E88E5" />
            <circle cx="15.5" cy="12" r="2.8" fill="#E91E63" />
            <circle cx="10.5" cy="17" r="2.8" fill="#43A047" />
          </svg>
        );
      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="4" width="19" height="16" rx="2.8" fill="#263238" />
            <rect x="2.5" y="4" width="19" height="4.5" rx="2" fill="#546E7A" />
            <circle cx="5.5" cy="6.2" r="1.1" fill="#FF5252" />
            <circle cx="8.5" cy="6.2" r="1.1" fill="#FFD740" />
            <circle cx="11.5" cy="6.2" r="1.1" fill="#69F0AE" />
            <path d="M6.8 11.8L9.8 14L6.8 16.2" stroke="#40C4FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.8 16.2H16.8" stroke="#69F0AE" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        );
      case 'play':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" fill="#FFFFFF" fillOpacity="0.25" />
            <path d="M9.5 7.4L17.2 12L9.5 16.6V7.4Z" fill="#FFEB3B" />
          </svg>
        );
      case 'stop':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" fill="#FFFFFF" fillOpacity="0.25" />
            <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1.4" fill="#FFEB3B" />
          </svg>
        );
      case 'copy':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="8" y="3.5" width="11.5" height="13" rx="2" fill="#FFE082" />
            <rect x="4.5" y="7" width="11.5" height="13" rx="2" fill="#FFFFFF" />
          </svg>
        );
      case 'save':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="2.4" fill="#29B6F6" />
            <rect x="7.5" y="12.5" width="9" height="7.5" fill="#FFFFFF" />
            <rect x="7.5" y="4" width="7" height="5" fill="#FFEE58" />
          </svg>
        );
      case 'reset':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17.8 8.6A6.5 6.5 0 1 0 18.5 13" stroke="#E53935" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M15.2 4.8L18.2 8.4L14.2 9.4" stroke="#FB8C00" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  }

  // =========================================================================
  // STYLE 3: LORDICON ANIMATED MULTI-COLOR (Lively Continuous Motion + Dual-Color)
  // =========================================================================
  if (stylePreset === 'lordicon') {
    switch (name) {
      case 'flash':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" fill="#FEF08A" fillOpacity="0.28" className="duo-radar-ring" />
            <path
              className="duo-breathe"
              d="M13.4 3.2L5.8 12.6H11.4L9.8 20.6L17.8 10.8H12.2L13.4 3.2Z"
              fill="#FDE047"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'shield':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3L19.5 6V11.8C19.5 16.5 16.3 20.3 12 21.5C7.7 20.3 4.5 16.5 4.5 11.8V6L12 3Z"
              stroke={active ? '#10B981' : '#6366F1'}
              strokeWidth="1.6"
              className="duo-aura-ring"
            />
            <path
              className="duo-breathe"
              d="M12 3.2L19.2 6.1V11.7C19.2 16.2 16.1 19.8 12 21C7.9 19.8 4.8 16.2 4.8 11.7V6.1L12 3.2Z"
              fill={active ? '#A7F3D0' : '#E0E7FF'}
              stroke={active ? '#059669' : '#4F46E5'}
              strokeWidth="2.1"
            />
            <path
              d="M8.6 12.2L11 14.5L15.6 9.6"
              stroke="#F59E0B"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'radar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="5.5" fill={active ? '#10B981' : '#F43F5E'} className="duo-radar-ring" />
            <circle cx="12" cy="12" r="7.5" stroke={active ? '#06B6D4' : '#FB7185'} strokeWidth="1.8" className="duo-aura-ring" />
            <circle cx="12" cy="12" r="4.4" fill={active ? '#059669' : '#E11D48'} />
          </svg>
        );
      case 'battery':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9.5" y="2.4" width="5" height="2" rx="1" fill="#F59E0B" />
            <rect x="6" y="4.8" width="12" height="16.2" rx="2.6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
            <rect x="7.5" y="9" width="9" height="10.4" rx="1.6" fill="#34D399" className="duo-breathe" />
            <path d="M12.7 8.4L9.5 12.8H12.2L11.4 17.2L14.6 12.4H11.9L12.7 8.4Z" fill="#DC2626" className="duo-cursor-blink" />
          </svg>
        );
      case 'sync':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.2" fill="#EDE9FE" className="duo-breathe" />
            <g className="spin-anim">
              <path d="M18 9.4A6.5 6.5 0 0 0 7 7.6" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M18.2 5.8V9.6H14.4" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 14.6A6.5 6.5 0 0 0 17 16.4" stroke="#EC4899" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M5.8 18.2V14.4H9.6" stroke="#EC4899" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );
      case 'link':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <g transform="rotate(-40 12 12)" className="duo-breathe">
              <rect x="3.5" y="8.5" width="9.6" height="7" rx="3.5" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.1" />
              <rect x="10.9" y="8.5" width="9.6" height="7" rx="3.5" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2.1" />
            </g>
          </svg>
        );
      case 'check_badge':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8" fill="#34D399" fillOpacity="0.4" className="duo-radar-ring" />
            <circle cx="12" cy="12" r="8.5" fill="#D1FAE5" stroke="#059669" strokeWidth="2" />
            <path d="M8.3 12.2L10.8 14.7L15.9 9.5" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'sliders':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7.5H20" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 12.5H20" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 17.5H20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            <circle cx="8.5" cy="7.5" r="2.6" fill="#FDE047" stroke="#4F46E5" strokeWidth="1.9" className="duo-breathe" />
            <circle cx="15.5" cy="12.5" r="2.6" fill="#FDE047" stroke="#DB2777" strokeWidth="1.9" className="duo-breathe" />
            <circle cx="10.5" cy="17.5" r="2.6" fill="#FDE047" stroke="#059669" strokeWidth="1.9" className="duo-breathe" />
          </svg>
        );
      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.8" y="3.8" width="18.4" height="16.4" rx="3.2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.8" />
            <circle cx="6" cy="6.5" r="1.2" fill="#FB7185" className="duo-cursor-blink" />
            <circle cx="9.2" cy="6.5" r="1.2" fill="#FBBF24" />
            <circle cx="12.4" cy="6.5" r="1.2" fill="#34D399" />
            <path d="M6.8 11.7L9.8 13.8L6.8 15.9" stroke="#F472B6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.8 15.9H16.8" stroke="#FDE047" strokeWidth="2.3" strokeLinecap="round" className="duo-cursor-blink" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.2" fill="#FFFFFF" fillOpacity="0.28" className="duo-breathe" />
            {name === 'play' && <path d="M9.6 7.4L17.1 12L9.6 16.6V7.4Z" fill="#FDE047" />}
            {name === 'stop' && <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1.6" fill="#FDE047" />}
            {name === 'copy' && <rect x="6" y="5" width="12" height="14" rx="2.2" fill="#FDE047" stroke="#FFFFFF" strokeWidth="1.8" />}
            {name === 'save' && <rect x="5" y="5" width="14" height="14" rx="2.4" fill="#34D399" stroke="#FFFFFF" strokeWidth="1.8" />}
            {name === 'reset' && <path d="M17.8 8.6A6.5 6.5 0 1 0 18.5 13" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" />}
          </svg>
        );
    }
  }

  // =========================================================================
  // STYLE 4: SOLAR / ICONSAX BULK DUOTONE (Soft Translucent Layer + Bold Core)
  // =========================================================================
  if (stylePreset === 'solar') {
    switch (name) {
      case 'flash':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.8" fill="#FFFFFF" fillOpacity="0.25" />
            <path d="M13.5 3.2L5.8 12.6H11.5L9.8 20.8L17.8 10.8H12.2L13.5 3.2Z" fill="#FFFFFF" />
          </svg>
        );
      case 'shield':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2.5L19.6 5.6V11.6C19.6 16.5 16.3 20.3 12 21.6C7.7 20.3 4.4 16.5 4.4 11.6V5.6L12 2.5Z"
              fill={active ? '#10B981' : '#3B82F6'}
              fillOpacity="0.32"
            />
            <path
              d="M8.5 12.2L11 14.6L15.6 9.6"
              stroke={active ? '#059669' : '#1D4ED8'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'radar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" fill={active ? '#10B981' : '#F43F5E'} fillOpacity="0.32" />
            <circle cx="12" cy="12" r="4.6" fill={active ? '#059669' : '#E11D48'} />
          </svg>
        );
      case 'battery':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="9.2" y="2" width="5.6" height="2.4" rx="1.2" fill="#F59E0B" />
            <rect x="5.5" y="4.5" width="13" height="16.8" rx="3.4" fill="#F59E0B" fillOpacity="0.3" />
            <path d="M12.7 8.4L9.4 13H12.2L11.3 17.4L14.6 12.5H11.9L12.7 8.4Z" fill="#D97706" />
          </svg>
        );
      case 'sync':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.6" fill="#6366F1" fillOpacity="0.24" />
            <g key={spinTrigger} className={spinTrigger > 0 ? 'duo-spin-once' : undefined}>
              <path d="M17.2 9.8A5.6 5.6 0 0 0 7.4 8.2M6.8 14.2A5.6 5.6 0 0 0 16.6 15.8" stroke="#4338CA" strokeWidth="2.3" strokeLinecap="round" />
              <path d="M17.4 6.4V10H13.8M6.6 17.6V14H10.2" stroke="#4338CA" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        );
      case 'link':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" fill="#8B5CF6" fillOpacity="0.22" />
            <path d="M9.5 14.5L14.5 9.5" stroke="#6D28D9" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M7.5 16.5L6.5 17.5C5.1 18.9 5.1 21 6.5 22.4" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        );
      case 'check_badge':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.4" fill="#10B981" fillOpacity="0.3" />
            <path d="M8.3 12.2L10.8 14.7L15.9 9.5" stroke="#047857" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'sliders':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="4" fill="#9333EA" fillOpacity="0.22" />
            <circle cx="9" cy="9" r="2.5" fill="#7E22CE" />
            <circle cx="15" cy="15" r="2.5" fill="#7E22CE" />
          </svg>
        );
      case 'terminal':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="3.5" width="19" height="17" rx="4.2" fill="#38BDF8" fillOpacity="0.28" />
            <path d="M7 10L10.5 13L7 16" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.5 16H17" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" fill="#FFFFFF" fillOpacity="0.3" />
            {name === 'play' && <path d="M9.6 7.4L17.1 12L9.6 16.6V7.4Z" fill="#FFFFFF" />}
            {name === 'stop' && <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1.8" fill="#FFFFFF" />}
            {name === 'copy' && <rect x="6.5" y="5.5" width="11" height="13" rx="2.5" fill="#FFFFFF" />}
            {name === 'save' && <rect x="5.5" y="5.5" width="13" height="13" rx="2.5" fill="#34D399" />}
            {name === 'reset' && <path d="M17.8 8.6A6.5 6.5 0 1 0 18.5 13" stroke="#E11D48" strokeWidth="2.3" strokeLinecap="round" />}
          </svg>
        );
    }
  }

  // =========================================================================
  // STYLE 5: STRIPE / LINEAR JEWEL GRADIENT (Default Multi-Color Gradient)
  // =========================================================================
  switch (name) {
    case 'flash':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`fl_${uid}`} x1="4" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <circle
            cx="12"
            cy="12"
            r="9.8"
            fill="#BAE6FD"
            fillOpacity={0.28}
            className={active ? 'duo-breathe' : undefined}
          />
          <path
            d="M14.3 3.7L6.5 13.1H12L10.6 20.8L18.5 11.1H13L14.3 3.7Z"
            fill="#FFFFFF"
            fillOpacity={0.35}
          />
          <path
            d="M13.2 3.1L5.7 12.5H11.3L9.8 20.3L17.6 10.6H12.1L13.2 3.1Z"
            fill={primaryColor || `url(#fl_${uid})`}
          />
        </svg>
      );

    case 'shield': {
      const c1 = active ? '#10B981' : '#3B82F6';
      const c2 = active ? '#06B6D4' : '#8B5CF6';
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`sh_fill_${uid}`} x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={c1} stopOpacity="0.28" />
              <stop offset="100%" stopColor={c2} stopOpacity="0.42" />
            </linearGradient>
            <linearGradient id={`sh_str_${uid}`} x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={c1} />
              <stop offset="100%" stopColor={c2} />
            </linearGradient>
          </defs>
          {active && (
            <path
              d="M12 3L19.5 6V11.8C19.5 16.5 16.3 20.3 12 21.5C7.7 20.3 4.5 16.5 4.5 11.8V6L12 3Z"
              stroke="#10B981"
              strokeWidth="1.4"
              className="duo-aura-ring"
            />
          )}
          <path
            d="M12 3.2L19.2 6.1V11.7C19.2 16.2 16.1 19.8 12 21C7.9 19.8 4.8 16.2 4.8 11.7V6.1L12 3.2Z"
            fill={`url(#sh_fill_${uid})`}
            stroke={`url(#sh_str_${uid})`}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8.8 12.2L11 14.4L15.4 9.8"
            stroke={active ? '#047857' : '#6D28D9'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    case 'radar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {active && (
            <circle
              cx="12"
              cy="12"
              r="5"
              fill={duoColor || '#06B6D4'}
              fillOpacity={0.5}
              className="duo-radar-ring"
            />
          )}
          <circle cx="12" cy="12" r="7" fill={duoColor || '#10B981'} fillOpacity={0.28} />
          <circle cx="12" cy="12" r="4.3" fill={primaryColor || '#059669'} />
        </svg>
      );

    case 'battery':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`bat_lvl_${uid}`} x1="7" y1="8" x2="17" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="55%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id={`bat_frm_${uid}`} x1="6" y1="4" x2="18" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect x="9.5" y="2.4" width="5" height="2" rx="1" fill="#D97706" />
          <rect
            x="7"
            y="8.2"
            width="10"
            height="11.8"
            rx="1.8"
            fill={`url(#bat_lvl_${uid})`}
            fillOpacity={0.42}
            className={active ? 'duo-breathe' : undefined}
          />
          <rect
            x="6"
            y="4.8"
            width="12"
            height="16.2"
            rx="2.6"
            stroke={`url(#bat_frm_${uid})`}
            strokeWidth="1.9"
          />
          <path
            d="M12.7 8.8L9.5 13H12.2L11.4 17L14.6 12.6H11.9L12.7 8.8Z"
            fill="#B45309"
          />
        </svg>
      );

    case 'sync':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`sy_bg_${uid}`} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.24" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="9.2" fill={`url(#sy_bg_${uid})`} />
          <g key={spinTrigger} className={spinTrigger > 0 ? 'duo-spin-once' : undefined}>
            <path
              d="M18.2 9.4A6.8 6.8 0 0 0 6.8 7.5"
              stroke="#0284C7"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d="M18.4 5.8V9.6H14.6"
              stroke="#0284C7"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.8 14.6A6.8 6.8 0 0 0 17.2 16.5"
              stroke="#7C3AED"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <path
              d="M5.6 18.2V14.4H9.4"
              stroke="#7C3AED"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      );

    case 'link':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <g transform="rotate(-40 12 12)">
            <rect
              x="3.5"
              y="8.6"
              width="9.6"
              height="6.8"
              rx="3.4"
              fill="#38BDF8"
              fillOpacity={0.28}
              stroke="#0284C7"
              strokeWidth="2"
            />
            <rect
              x="10.9"
              y="8.6"
              width="9.6"
              height="6.8"
              rx="3.4"
              fill="#A855F7"
              fillOpacity={0.28}
              stroke="#7C3AED"
              strokeWidth="2"
            />
          </g>
        </svg>
      );

    case 'check_badge':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`cb_${uid}`} x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          {active && (
            <circle
              cx="12"
              cy="12"
              r="7.6"
              fill="#10B981"
              fillOpacity={0.36}
              className="duo-aura-ring"
            />
          )}
          <circle
            cx="12"
            cy="12"
            r="8.5"
            fill="#10B981"
            fillOpacity={0.22}
            stroke={`url(#cb_${uid})`}
            strokeWidth="2"
          />
          <path
            d="M8.3 12.2L10.8 14.7L15.9 9.5"
            stroke="#059669"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'sliders':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7.5H20" stroke="#6366F1" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M4 12.5H20" stroke="#EC4899" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M4 17.5H20" stroke="#F59E0B" strokeWidth="1.9" strokeLinecap="round" />
          <circle cx="8.5" cy="7.5" r="2.4" fill="#818CF8" stroke="#4F46E5" strokeWidth="1.7" />
          <circle cx="15.5" cy="12.5" r="2.4" fill="#F472B6" stroke="#DB2777" strokeWidth="1.7" />
          <circle cx="10.5" cy="17.5" r="2.4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.7" />
        </svg>
      );

    case 'terminal':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`tm_${uid}`} x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect x="2.8" y="3.8" width="18.4" height="16.4" rx="3.2" fill={`url(#tm_${uid})`} />
          <path
            d="M2.8 7C2.8 5.23 4.23 3.8 6 3.8H18C19.77 3.8 21.2 5.23 21.2 7V8.4H2.8V7Z"
            fill="#334155"
          />
          <circle cx="5.7" cy="6.1" r="1.05" fill="#FB7185" />
          <circle cx="8.7" cy="6.1" r="1.05" fill="#FBBF24" />
          <circle cx="11.7" cy="6.1" r="1.05" fill="#34D399" />
          <path
            d="M6.8 11.7L9.8 13.8L6.8 15.9"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.8 15.9H16.8"
            stroke="#34D399"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="duo-cursor-blink"
          />
        </svg>
      );

    case 'play':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9.6" fill="#FFFFFF" fillOpacity={0.24} />
          <path d="M9.6 7.4L17.1 12L9.6 16.6V7.4Z" fill="#FEF08A" />
        </svg>
      );

    case 'stop':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9.6" fill="#FFFFFF" fillOpacity={0.24} />
          <rect x="8.2" y="8.2" width="7.6" height="7.6" rx="1.6" fill="#FFFFFF" />
        </svg>
      );

    case 'copy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="7.6"
            y="3.8"
            width="11.8"
            height="13.2"
            rx="2.2"
            fill="#FDE047"
            fillOpacity={0.32}
            stroke="#FEF08A"
            strokeWidth="1.8"
          />
          <rect
            x="4.6"
            y="7"
            width="11.8"
            height="13.2"
            rx="2.2"
            fill="#FFFFFF"
            fillOpacity={0.25}
            stroke="#FFFFFF"
            strokeWidth="1.8"
          />
        </svg>
      );

    case 'save':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="4.2"
            y="4.2"
            width="15.6"
            height="15.6"
            rx="2.6"
            fill="#34D399"
            fillOpacity={0.26}
            stroke="#34D399"
            strokeWidth="1.9"
          />
          <rect x="7.8" y="12.5" width="8.4" height="7.3" fill="#38BDF8" fillOpacity={0.48} />
          <path d="M8 4.4V8.8H15.2V4.4" stroke="#F8FAFC" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );

    case 'reset':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.8" fill="#F43F5E" fillOpacity={0.16} />
          <path
            d="M17.8 8.6A6.5 6.5 0 1 0 18.5 13"
            stroke="#E11D48"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            d="M15.2 4.8L18.2 8.4L14.2 9.4"
            stroke="#F59E0B"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};
