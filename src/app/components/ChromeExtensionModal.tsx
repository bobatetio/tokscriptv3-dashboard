import { useEffect, useContext } from 'react';
import { X } from 'lucide-react';
import Rd from '../../imports/Rd';
import { ThemeContext } from '../context/ThemeContext';
import { useExtensionModal } from '../context/ChromeExtensionModalContext';

export default function ChromeExtensionModal() {
  const { isOpen, close } = useExtensionModal();
  const { isDark } = useContext(ThemeContext);

  const border = isDark ? '#262626' : '#e5e7eb';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#888888' : '#6b7280';
  const cardBg = isDark ? '#141414' : '#ffffff';

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, close]);

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={close}
    >
      <div
        className="relative w-full flex flex-col rounded-2xl overflow-hidden"
        style={{
          maxWidth: 680,
          background: isDark ? '#0d0d0d' : '#ffffff',
          boxShadow: isDark
            ? '0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.7)'
            : '0 0 0 1px rgba(0,0,0,0.08), 0 24px 80px rgba(0,0,0,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close X button */}
        <button
          onClick={close}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-lg transition-colors"
          style={{ color: muted }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-6 pt-5">
          {/* A. Header Area (centered) */}
          <div className="text-center mb-5">
            <h2 className="text-sm font-semibold mb-1.5" style={{ color: text }}>
              Set up the Chrome Extension
            </h2>
            <p className="text-[11px] max-w-md mx-auto" style={{ color: muted, lineHeight: 1.5 }}>
              Import videos directly from TikTok, YouTube, and Instagram while you browse — no URL copying needed.
            </p>
          </div>

          {/* B. Two-Column "How it works" Card */}
          <div className="grid grid-cols-2 rounded-2xl overflow-hidden" style={{ border: `1px solid ${border}`, background: cardBg, minHeight: 220 }}>
            {/* Left column — Browser mockup illustration */}
            <div className="p-5 flex items-center justify-center" style={{ borderRight: '1px solid ' + border }}>
              <div className="w-full max-w-[220px]">
                {/* Browser top bar */}
                <div className="rounded-t-xl overflow-hidden" style={{ border: `1px solid ${border}`, borderBottom: 'none' }}>
                  <div className="px-3 py-2 flex items-center gap-2" style={{ background: isDark ? '#1a1a1a' : '#e5e7eb' }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: isDark ? '#333' : '#ccc' }} />
                      ))}
                    </div>
                    <div className="flex-1 h-2.5 rounded" style={{ background: isDark ? '#333' : '#ccc' }} />
                  </div>
                  {/* Page content skeleton */}
                  <div className="p-3 space-y-1.5 relative" style={{ background: isDark ? '#111' : '#f9fafb' }}>
                    {['w-full', 'w-4/5', 'w-3/5'].map((w, i) => (
                      <div key={i} className={`h-1 rounded-full ${w}`} style={{ background: isDark ? '#222' : '#e5e7eb' }} />
                    ))}
                    <div className="h-10 rounded-lg mt-1.5" style={{ background: isDark ? '#1a1a1a' : '#efefef' }} />
                    <div className="h-1 rounded-full w-full" style={{ background: isDark ? '#222' : '#e5e7eb' }} />
                    <div className="h-1 rounded-full w-2/3" style={{ background: isDark ? '#222' : '#e5e7eb' }} />

                    {/* Extension popup overlay */}
                    <div className="absolute top-2 right-2 rounded-lg p-2 shadow-lg" style={{
                      background: isDark ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${border}`,
                      width: 90,
                    }}>
                      <div className="h-1 rounded-full w-3/4 mb-1.5" style={{ background: isDark ? '#333' : '#e5e7eb' }} />
                      <div className="h-1 rounded-full w-1/2 mb-2" style={{ background: isDark ? '#333' : '#e5e7eb' }} />
                      <div className="h-4 rounded" style={{ background: '#00b8b2', opacity: 0.9 }} />
                    </div>
                  </div>
                </div>
                {/* Browser bottom bar */}
                <div className="rounded-b-xl h-2" style={{ border: `1px solid ${border}`, borderTop: 'none', background: isDark ? '#1a1a1a' : '#e5e7eb' }} />
              </div>
            </div>

            {/* Right column — 3 numbered steps */}
            <div className="p-5 flex flex-col justify-center gap-4">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-medium"
                  style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', color: muted }}
                >
                  1
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: text }}>Install the extension</p>
                  <p className="text-[10px] leading-relaxed" style={{ color: muted }}>
                    Add TokScript to Chrome from the Web Store. One click — works on Chrome, Edge, Brave, and Arc.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-medium"
                  style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', color: muted }}
                >
                  2
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: text }}>It connects automatically</p>
                  <p className="text-[10px] leading-relaxed" style={{ color: muted }}>
                    The extension syncs with your TokScript account instantly. No extra sign-in or setup required.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-medium"
                  style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', color: muted }}
                >
                  3
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: text }}>Browse and import</p>
                  <p className="text-[10px] leading-relaxed" style={{ color: muted }}>
                    Visit any TikTok, YouTube, or Instagram video and click the TokScript icon to send it to your library.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* C. CTA Area */}
          <div className="flex flex-col items-center gap-2.5 mt-5">
            <button
              onClick={() => window.open('https://chrome.google.com/webstore', '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-2 px-5 h-9 rounded-xl text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: '#00b8b2', color: '#fff' }}
            >
              <div style={{ width: 14, height: 14, flexShrink: 0 }}><Rd /></div>
              Add to Chrome — it's free
            </button>
            <p className="text-[10px]" style={{ color: muted }}>
              Already installed? Just open the extension popup and sign in.
            </p>
            <div className="flex items-center gap-2">
              {['Chrome', 'Edge', 'Brave', 'Arc'].map(b => (
                <span key={b} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: muted }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
