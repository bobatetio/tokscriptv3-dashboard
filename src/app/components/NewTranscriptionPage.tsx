import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronDown, Globe,
  ChevronRight, Sparkles, X,
  CheckCircle2, AlertCircle, Lock,
} from 'lucide-react';

import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { AppSidebar } from './AppSidebar';
import OutlineSearchMagnifer from '../../imports/OutlineSearchMagnifer';
import { AppLogo } from './AppLogo';
import { AppHeader } from './AppHeader';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian',
  'Portuguese', 'Japanese', 'Korean', 'Chinese', 'Arabic',
  'Hindi', 'Russian',
];

const MAX_LINKS = 50;

function isValidUrl(line: string) {
  try { new URL(line.trim()); return true; } catch { return false; }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function NewTranscriptionPage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useContext(ThemeContext);
  const { plan, openUpgrade, transcriptionsUsed, transcriptionsLimit } = useContext(UserContext);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [value, setValue] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // ── Locked palette (identical to DashboardPage) ───────────────────────────
  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : '#efefed';
  const cardBg  = isDark ? '#141414' : '#ffffff';
  const subtle  = isDark ? '#262626' : '#d1d5db';

  const lines        = value.split('\n').filter(l => l.trim() !== '');
  const validLines   = lines.filter(isValidUrl);
  const invalidLines = lines.filter(l => !isValidUrl(l));
  const atLimit      = lines.length >= MAX_LINKS;

  // auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 320) + 'px';
  }, [value]);

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const dropped = e.dataTransfer.getData('text');
    if (dropped) appendLinks(dropped);
  };

  const appendLinks = (raw: string) => {
    const existing = value.trim();
    setValue(existing ? existing + '\n' + raw.trim() : raw.trim());
  };

  const pasteFromClipboard = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      appendLinks(txt);
      textareaRef.current?.focus();
    } catch { /* permission denied */ }
  };

  const handleScan = () => {
    if (validLines.length === 0) return;
    if (plan === 'free' && transcriptionsUsed >= transcriptionsLimit) {
      openUpgrade();
      return;
    }
    navigate('/results');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: isDark ? '#0a0a0a' : '#ffffff' }}>
      <AppSidebar activePage="new-transcription" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden"
           style={isDark ? undefined : { background: '#ffffff' }}>
        <AppHeader />

        {/* Main area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Sub-header / breadcrumb */}
          <header
            className="flex items-center justify-between px-5 h-[52px] flex-shrink-0"
            style={{ borderBottom: `1px solid ${border}` }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                style={{ color: muted }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                Dashboard
              </button>
              <span style={{ color: subtle }}>/</span>
              <span className="text-xs" style={{ color: text, fontWeight: 500 }}>New Transcription</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Transcription quota — free users */}
              {plan === 'free' && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(transcriptionsUsed / transcriptionsLimit) * 100}%`,
                          background: transcriptionsUsed >= transcriptionsLimit ? '#ef4444' : 'linear-gradient(90deg,#00b8b2,#0077ff)',
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: muted }}>{transcriptionsUsed}/{transcriptionsLimit}</span>
                  </div>
                  <button
                    onClick={openUpgrade}
                    className="text-xs px-2 py-1 rounded-md transition-all"
                    style={{ background: 'linear-gradient(135deg, #00b8b2 0%, #0077ff 100%)', color: '#ffffff', fontWeight: 600 }}
                  >
                    Upgrade
                  </button>
                </div>
              )}
              <span
                className="text-xs px-2 py-1 rounded-md"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f0fdf4', color: '#16a34a', fontWeight: 500 }}
              >
                {validLines.length} / {MAX_LINKS} links
              </span>
            </div>
          </header>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start px-6 pt-12 pb-16">

            {/* Heading */}
            <div className="w-full max-w-2xl text-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: `1px solid ${border}` }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: '#00b8b2' }} />
                <span className="text-xs" style={{ color: muted }}>AI-powered transcription</span>
              </div>
              <h1 className="mb-3 tracking-tight" style={{ color: text, fontSize: 36, lineHeight: '1.15' }}>
                Turn videos into transcripts
              </h1>
              <p className="text-sm" style={{ color: muted, lineHeight: 1.7 }}>
                Paste up to {MAX_LINKS} video links from TikTok, Instagram, YouTube, and more.<br />
                We'll extract, transcribe, and save them to your library.
              </p>
            </div>

            {/* ── Input card ── */}
            <div
              className="w-full max-w-2xl rounded-2xl overflow-hidden transition-all"
              style={{
                background: cardBg,
                border: `1.5px solid ${isDragging ? '#00b8b2' : isFocused ? (isDark ? '#ffffff' : '#111827') : border}`,
              }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {/* Textarea */}
              <div className="px-5 pt-4 pb-2">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={e => {
                    const ls = e.target.value.split('\n');
                    if (ls.filter(l => l.trim()).length > MAX_LINKS) return;
                    setValue(e.target.value);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={'Paste video links here, one per line…\nhttps://www.tiktok.com/@user/video/123\nhttps://www.instagram.com/reel/abc123'}
                  className="w-full resize-none bg-transparent text-sm outline-none leading-relaxed"
                  style={{
                    color: text,
                    minHeight: 96,
                    maxHeight: 320,
                    caretColor: '#00b8b2',
                  }}
                />
              </div>

              {/* Validation badges */}
              {lines.length > 0 && (
                <div className="mx-5 mb-2 flex flex-wrap gap-2">
                  {validLines.length > 0 && (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                      <CheckCircle2 className="w-3 h-3" /> {validLines.length} valid link{validLines.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {invalidLines.length > 0 && (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#fef2f2', color: '#dc2626' }}>
                      <AlertCircle className="w-3 h-3" /> {invalidLines.length} invalid
                    </span>
                  )}
                  {atLimit && (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#fefce8', color: '#ca8a04' }}>
                      Limit reached ({MAX_LINKS} links)
                    </span>
                  )}
                </div>
              )}

              {/* Bottom action bar */}
              <div className="flex items-center justify-between px-4 py-3">
                {/* Language */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setLangOpen(o => !o)}
                      className="flex items-center gap-1.5 text-xs transition-colors"
                      style={{ color: muted }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = text; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Retranslate
                      <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {langOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                        <div
                          className="absolute left-0 bottom-full mb-2 w-40 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                          style={{ background: cardBg, border: `1px solid ${border}`, maxHeight: 208, overflowY: 'auto' }}
                        >
                          {LANGUAGES.map(lang => (
                            <button
                              key={lang}
                              onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                              className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
                              style={{
                                color: selectedLang === lang ? '#00b8b2' : muted,
                                background: selectedLang === lang ? (isDark ? 'rgba(0,184,178,0.08)' : 'rgba(0,242,234,0.06)') : 'transparent',
                                fontWeight: selectedLang === lang ? 500 : 400,
                              }}
                              onMouseEnter={e => { if (selectedLang !== lang) (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                              onMouseLeave={e => { if (selectedLang !== lang) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            >
                              {lang}
                              {selectedLang === lang && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00b8b2' }} />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {selectedLang !== 'English' && (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{ background: isDark ? 'rgba(0,184,178,0.1)' : 'rgba(0,242,234,0.1)', color: '#00b8b2' }}>
                      {selectedLang}
                      <button onClick={() => setSelectedLang('English')}><X className="w-2.5 h-2.5" /></button>
                    </span>
                  )}
                </div>

                {/* Free quota warning */}
                {plan === 'free' && transcriptionsUsed >= transcriptionsLimit && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#ef4444' }} />
                    <span className="text-xs" style={{ color: '#ef4444' }}>Monthly limit reached.</span>
                    <button onClick={openUpgrade} className="text-xs" style={{ color: '#ef4444', textDecoration: 'underline', textUnderlineOffset: 2 }}>Upgrade</button>
                  </div>
                )}

                {/* Submit */}
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: muted }}>{lines.length}/{MAX_LINKS}</span>
                  <button
                    onClick={handleScan}
                    disabled={validLines.length === 0}
                    className="flex items-center gap-1.5 px-3 h-8 rounded-xl text-xs transition-colors"
                    style={{
                      background: validLines.length > 0 ? (isDark ? '#ffffff' : '#111111') : (isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'),
                      color: validLines.length > 0 ? (isDark ? '#111111' : '#ffffff') : muted,
                      fontWeight: 500,
                      cursor: validLines.length > 0 ? 'pointer' : 'not-allowed',
                    }}
                    onMouseEnter={e => { if (validLines.length > 0) (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#e8e8e8' : '#2a2a2a'; }}
                    onMouseLeave={e => { if (validLines.length > 0) (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#ffffff' : '#111111'; }}
                  >
                    <span style={{ '--fill-0': validLines.length > 0 ? (isDark ? '#111111' : '#ffffff') : muted } as React.CSSProperties}>
                      <OutlineSearchMagnifer className="relative w-3.5 h-3.5 flex-shrink-0" />
                    </span>
                    Scan Videos
                  </button>
                </div>
              </div>
            </div>

            {/* Try-it link */}
            <div className="w-full max-w-2xl mt-3 flex items-center gap-1.5">
              <span className="text-xs" style={{ color: muted }}>Try it with this example:</span>
              <button
                onClick={() => setValue('https://www.tiktok.com/@bradonlamar/video/7386531492462723358')}
                className="text-xs transition-colors"
                style={{ color: '#00b8b2', textDecoration: 'underline', textUnderlineOffset: 3 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#00d4cc'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#00b8b2'; }}
              >
                @bradonlamar video
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}