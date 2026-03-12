/**
 * UpgradeModal
 * ─────────────
 * Full-screen paywall modal. Shown whenever a free user hits a gated feature.
 */
import React, { useContext, useState } from 'react';
import { X, Check, Zap, Lock } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';

const PRO_FEATURES = [
  'Unlimited transcript storage',
  'Collections & Bulk processing',
  'Full Prompt Base access (200+ prompts)',
  'Analytics & word insights',
  'Unlimited Discover browsing',
  'Priority transcription queue',
  'Export in all formats (PDF, DOCX, MD)',
  'Folder organisation (unlimited)',
  'Creator profile tracking',
  'Early access to new features',
];

const FREE_FEATURES = [
  '3 single transcripts / month',
  '5 Prompt Base prompts',
  '5 Discover transcript views',
  '2 folders',
  'Basic .txt export',
];

export function UpgradeModal() {
  const { isDark } = useContext(ThemeContext);
  const { closeUpgrade, setPlan } = useContext(UserContext);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');
  const [upgrading, setUpgrading] = useState(false);

  const price = billing === 'annual' ? 15 : 19;
  const saving = billing === 'annual' ? 48 : 0;

  const bg       = isDark ? '#0d0d0d' : '#ffffff';
  const surface  = isDark ? '#141414' : '#f9fafb';
  const border   = isDark ? '#262626' : '#e5e7eb';
  const text      = isDark ? '#ffffff' : '#111827';
  const muted    = isDark ? '#888888' : '#6b7280';
  const cardBg   = isDark ? '#1a1a1a' : '#ffffff';

  const handleUpgrade = () => {
    setUpgrading(true);
    setTimeout(() => {
      setPlan('pro');
      setUpgrading(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) closeUpgrade(); }}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col"
        style={{ background: bg, border: `1px solid ${border}`, maxHeight: '92vh' }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-8 pt-8 pb-6 flex-shrink-0"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #00b8b2 0%, #0077ff 100%)' }}
              >
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <p style={{ color: text, fontWeight: 700, fontSize: '1.1rem' }}>Upgrade to Tokscript Pro</p>
            </div>
            <p className="text-sm mt-1" style={{ color: muted }}>
              Unlock every feature and process transcripts without limits.
            </p>
          </div>
          <button
            onClick={closeUpgrade}
            className="p-1.5 rounded-lg transition-colors flex-shrink-0 mt-0.5"
            style={{ color: muted, background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Billing toggle */}
        <div className="px-8 py-5 flex-shrink-0 flex items-center justify-between">
          <div
            className="flex items-center p-1 rounded-xl gap-1"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            {(['monthly', 'annual'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="px-4 py-1.5 rounded-lg text-xs transition-all capitalize"
                style={{
                  background: billing === b ? (isDark ? '#262626' : '#ffffff') : 'transparent',
                  color: billing === b ? text : muted,
                  fontWeight: billing === b ? 600 : 400,
                  boxShadow: billing === b ? (isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.08)') : 'none',
                  border: billing === b ? `1px solid ${border}` : '1px solid transparent',
                }}
              >
                {b}
              </button>
            ))}
          </div>
          {billing === 'annual' && (
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,184,178,0.12)', color: '#00b8b2', fontWeight: 600 }}
            >
              Save ${saving}/yr
            </span>
          )}
        </div>

        {/* Plans grid */}
        <div className="px-8 pb-6 flex-shrink-0 grid grid-cols-2 gap-4">

          {/* Free plan */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: surface, border: `1px solid ${border}` }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest" style={{ color: muted, fontWeight: 600 }}>Free</p>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0', color: muted, fontWeight: 600 }}
                >
                  Current plan
                </span>
              </div>
              <p style={{ color: text, fontWeight: 700, fontSize: '1.5rem' }}>$0<span className="text-sm" style={{ color: muted, fontWeight: 400 }}>/mo</span></p>
            </div>
            <div className="flex flex-col gap-2">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: muted }} />
                  <span className="text-xs" style={{ color: muted }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro plan */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden"
            style={{
              background: isDark ? 'rgba(0,184,178,0.07)' : 'rgba(0,184,178,0.04)',
              border: '1.5px solid rgba(0,184,178,0.35)',
            }}
          >
            {/* Glow */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,184,178,0.15) 0%, transparent 70%)', transform: 'translate(25%, -25%)' }}
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest" style={{ color: '#00b8b2', fontWeight: 600 }}>Pro</p>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,184,178,0.15)', color: '#00b8b2', fontWeight: 600 }}
                >
                  Recommended
                </span>
              </div>
              <p style={{ color: text, fontWeight: 700, fontSize: '1.5rem' }}>
                ${price}<span className="text-sm" style={{ color: muted, fontWeight: 400 }}>/mo</span>
              </p>
              {billing === 'annual' && (
                <p className="text-[11px]" style={{ color: muted }}>Billed as ${price * 12}/year</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {PRO_FEATURES.slice(0, 7).map(f => (
                <div key={f} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#00b8b2' }} />
                  <span className="text-xs" style={{ color: text }}>{f}</span>
                </div>
              ))}
              <p className="text-[11px] mt-1" style={{ color: muted }}>+ {PRO_FEATURES.length - 7} more features</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className="px-8 pb-8 flex-shrink-0 flex flex-col gap-3"
        >
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
            style={{
              background: upgrading ? (isDark ? '#1a1a1a' : '#f0f0f0') : 'linear-gradient(135deg, #00b8b2 0%, #0077ff 100%)',
              color: upgrading ? muted : '#ffffff',
              fontWeight: 600,
              border: 'none',
              cursor: upgrading ? 'not-allowed' : 'pointer',
              opacity: upgrading ? 0.7 : 1,
            }}
          >
            {upgrading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Upgrading…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Upgrade to Pro — ${price}/mo
              </>
            )}
          </button>
          <p className="text-center text-[11px]" style={{ color: muted }}>
            No contracts · Cancel anytime · Instant access
          </p>
        </div>
      </div>
    </div>
  );
}
