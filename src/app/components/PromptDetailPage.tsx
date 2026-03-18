/**
 * PromptDetailPage  (/prompt-base/:id)
 * ──────────────────────────────────────
 * Dedicated page for a single prompt. Supports copy and .txt download.
 * Data comes from route state (fast path) or falls back to lookup by id param.
 */
import { useState, useContext } from 'react';
import type React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import {
  ArrowLeft, Copy, CheckCheck, Download,
  BookOpen, ChevronDown, FileText, Heart, Play,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { formatDuration } from '../utils/formatDuration';
import { formatCardDate } from '../utils/formatDate';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import {
  PROMPTS, CATEGORY_ICONS, CATEGORY_COLORS,
  type Prompt,
} from './PromptBasePage';
import { MY_HISTORY, type HistoryEntry } from './DiscoverPage';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ─── Platform colours (matches DiscoverPage) ──────────────────────────────────
const PLATFORM_META: Record<string, { color: string; bg: string }> = {
  TikTok:      { color: '#ffffff', bg: '#010101' },
  Instagram:   { color: '#ffffff', bg: '#e1306c' },
  YouTube:     { color: '#ffffff', bg: '#ff0000' },
};

// ─── Sidebar transcript card ───────────────────────────────────────────────────
function SidebarTranscriptCard({
  entry, isDark, border, text, muted, hoverBg, onClick,
}: {
  entry: HistoryEntry; isDark: boolean; border: string; text: string;
  muted: string; hoverBg: string; onClick: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [faved, setFaved] = useState(false);
  const meta = PLATFORM_META[entry.platform] ?? { color: '#fff', bg: '#6b7280' };
  const cardBg = isDark ? '#141414' : '#ffffff';

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col"
      style={{ border: `1px solid ${border}`, background: cardBg }}
      onClick={onClick}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = hoverBg; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = cardBg; }}
    >
      {/* Portrait 9:16 thumbnail */}
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ aspectRatio: '9/16' }}>
        <ImageWithFallback src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)' }} />
        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <Play className="w-3 h-3 text-white fill-white" />
          </div>
        </div>
        {/* Bottom bar: platform badge + duration */}
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          {/* Frosted glass badge in dark mode, solid in light */}
          {isDark ? (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px]"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: '#ffffff',
                fontWeight: 600,
                backdropFilter: 'blur(6px)',
              }}
            >
              {entry.platform === 'YouTube' && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>
              )}
              {entry.platform === 'TikTok' && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 1h-3.4v14.6a3 3 0 0 1-3 2.9 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.3 0 .5 0 .8.1V9c-.2 0-.5-.1-.8-.1a6.7 6.7 0 0 0-6.7 6.7 6.7 6.7 0 0 0 6.7 6.7 6.7 6.7 0 0 0 6.7-6.7V8.8a9.1 9.1 0 0 0 5.3 1.7V7.1A5.1 5.1 0 0 1 19.6 1z" /></svg>
              )}
              {entry.platform === 'Instagram' && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              )}
              {entry.platform}
            </span>
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px]" style={{ background: meta.bg, color: meta.color, fontWeight: 600 }}>
              {entry.platform}
            </span>
          )}
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>
            {formatDuration(entry.duration)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[10px]" style={{ color: muted }}>{entry.creator}</span>
        <p className="text-xs" style={{ color: text, fontWeight: 600, lineHeight: 1.35 }}>{entry.title}</p>
        <p
          className="text-[10px]"
          style={{
            color: muted, lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          } as React.CSSProperties}
        >
          {entry.transcriptSnippet}
        </p>
        {/* Actions */}
        <div className="flex items-center justify-between mt-auto pt-1.5">
          <span className="text-[10px]" style={{ color: muted }}>{formatCardDate(entry.date)}</span>
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button
              className="p-1 rounded-md transition-colors"
              style={{
                color: faved ? '#ef4444' : muted,
                background: faved ? (isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.07)') : (isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'),
                border: `1px solid ${faved ? 'rgba(239,68,68,0.28)' : border}`,
              }}
              onClick={() => setFaved(v => !v)}
              onMouseEnter={ev => { if (!faved) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { if (!faved) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
            >
              <Heart className="w-2.5 h-2.5" style={{ fill: faved ? '#ef4444' : 'none' }} />
            </button>
            <button
              className="p-1 rounded-md transition-colors"
              style={{
                color: copied ? '#00b8b2' : muted,
                background: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
                border: `1px solid ${border}`,
              }}
              onClick={() => {
                navigator.clipboard.writeText(entry.transcriptSnippet).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6'; }}
            >
              {copied ? <CheckCheck className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function PromptDetailPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { id }     = useParams<{ id: string }>();
  const { isDark } = useContext(ThemeContext);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showDlDropdown, setShowDlDropdown] = useState(false);
  const [similarTab, setSimilarTab] = useState<'recent' | 'related' | 'viral'>('related');

  // ─── Theme tokens ─────────────────────────────────────────────────────────
  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6';
  const cardBg  = isDark ? '#141414' : '#ffffff';
  const codeBg  = isDark ? '#0d0d0d' : '#f9fafb';

  // ── Resolve prompt from state or by id ───────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statePrompt = (location.state as any)?.prompt as Prompt | undefined;
  const foundPrompt: Prompt | undefined =
    statePrompt ?? PROMPTS.find(p => p.id === Number(id));

  // Always produce a renderable prompt — never show "not found"
  const prompt: Prompt = foundPrompt ?? {
    id: 0,
    title: String(id ?? 'Prompt')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()),
    description: 'This prompt is ready to use. Copy it and paste it into your favourite AI tool.',
    category: 'Script',
    tags: [],
    prompt: 'Paste your transcript here and run this prompt in ChatGPT, Claude, or any AI tool.',
    featured: false,
    uses: 0,
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.prompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format: 'txt' | 'md' | 'pdf' | 'docx' = 'txt') => {
    if (!prompt) return;
    const slug = prompt.title.toLowerCase().replace(/\s+/g, '-');

    if (format === 'pdf') {
      // Browser-native print-to-PDF
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`<!DOCTYPE html><html><head><title>${prompt.title}</title><style>body{font-family:sans-serif;max-width:700px;margin:48px auto;color:#111}h1{font-size:1.4rem;margin-bottom:8px}h2{font-size:1rem;margin-top:24px}pre{white-space:pre-wrap;word-break:break-word;font-size:0.85rem;color:#444;background:#f9fafb;padding:16px;border-radius:8px}p{color:#555;font-size:0.9rem}</style></head><body><h1>${prompt.title}</h1><p>${prompt.description}</p><h2>Prompt</h2><pre>${prompt.prompt}</pre></body></html>`);
        win.document.close();
        win.focus();
        win.print();
      }
    } else if (format === 'docx') {
      // Fallback: download as plain-text with .docx extension
      const content = `${prompt.title}\n\n${prompt.description}\n\nPrompt\n------\n${prompt.prompt}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${slug}.docx`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const content = format === 'md'
        ? `# ${prompt.title}\n\n${prompt.description}\n\n## Prompt\n\n\`\`\`\n${prompt.prompt}\n\`\`\``
        : prompt.prompt;
      const mime = format === 'md' ? 'text/markdown' : 'text/plain';
      const blob = new Blob([content], { type: `${mime};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${slug}.${format}`; a.click();
      URL.revokeObjectURL(url);
    }

    setShowDlDropdown(false);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleDownloadSkill = () => {
    if (!prompt) return;
    const content = JSON.stringify({ id: prompt.id, title: prompt.title, category: prompt.category, tags: prompt.tags, prompt: prompt.prompt }, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${prompt.title.toLowerCase().replace(/\s+/g, '-')}-skill.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Related prompts (same category, exclude self) ─────────────────────
  const related = PROMPTS.filter(p => p.category === prompt.category && p.id !== prompt.id).slice(0, 4);

  // ── Similar prompts (different category, shared tags) ─────────────────────
  const similar = PROMPTS.filter(p =>
    p.category !== prompt.category &&
    p.id !== prompt.id &&
    p.tags.some(t => prompt.tags.includes(t))
  ).slice(0, 3);

  const col = CATEGORY_COLORS[prompt.category] ?? CATEGORY_COLORS['Script'];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: isDark ? '#0a0a0a' : '#ffffff' }}>
      <AppSidebar activePage="prompt-base" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden"
           style={isDark ? undefined : { background: '#ffffff' }}>
        <AppHeader
          leftSlot={
            <button
              className="flex items-center gap-1.5 p-1.5 rounded-lg transition-colors text-xs"
              style={{ color: muted }}
              onClick={() => navigate(-1)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
                (e.currentTarget as HTMLButtonElement).style.color = text;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = muted;
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          }
        />

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Breadcrumb bar */}
          <div
            className="flex items-center gap-2 px-6 h-[52px] flex-shrink-0"
            style={{ borderBottom: `1px solid ${border}` }}
          >
            <button
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: muted }}
              onClick={() => navigate('/prompt-base')}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = text)}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = muted)}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Prompt Base
            </button>
            <span style={{ color: muted }} className="text-xs">›</span>
            <span className="text-xs truncate" style={{ color: text, fontWeight: 500 }}>{prompt.title}</span>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full">

              {/* ── Left: Prompt detail ────────────────────────────────── */}
              <div className="flex-1 min-w-0 px-8 py-8 flex flex-col gap-6 overflow-y-auto" style={{ maxWidth: 780 }}>

                {/* Header */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                      style={{
                        background: isDark ? col.darkBg : col.bg,
                        color: isDark ? col.darkText : col.text,
                        fontWeight: 600,
                        border: `1px solid ${border}`,
                      }}
                    >
                      {CATEGORY_ICONS[prompt.category]}
                      {prompt.category}
                    </span>
                    <span className="text-xs ml-auto flex-shrink-0" style={{ color: muted }}>
                      {(prompt.uses / 1000).toFixed(1)}k uses
                    </span>
                  </div>

                  <p style={{ color: text, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.3 }}>
                    {prompt.title}
                  </p>
                  <p style={{ color: muted, fontSize: '0.875rem', lineHeight: 1.7 }}>
                    {prompt.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {prompt.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs"
                        style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6', color: muted, border: `1px solid ${border}` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderBottom: `1px solid ${border}` }} />

                {/* Full prompt */}
                <div className="flex flex-col gap-3">
                  <p className="text-xs uppercase tracking-widest" style={{ color: isDark ? 'rgba(255,255,255,0.28)' : '#9ca3af', fontWeight: 600 }}>
                    Prompt
                  </p>
                  <div
                    className="rounded-2xl p-5 relative"
                    style={{ background: codeBg, border: `1px solid ${border}` }}
                  >
                    <style>{`.prompt-pre-scroll::-webkit-scrollbar { display: none; }`}</style>
                    <pre
                      className="text-xs whitespace-pre-wrap break-words m-0 overflow-y-auto prompt-pre-scroll"
                      style={{
                        color: isDark ? 'rgba(255,255,255,0.72)' : '#374151',
                        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                        lineHeight: 1.75,
                        maxHeight: '280px',
                        paddingRight: '10px',
                        scrollbarWidth: 'none',
                      } as React.CSSProperties}
                    >
                      {prompt.prompt}
                    </pre>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  {/* Copy Prompt */}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all flex-1 justify-center"
                    style={{
                      background: isDark ? '#1a1a1a' : '#111111',
                      color: '#ffffff',
                      fontWeight: 500,
                      border: `1px solid ${isDark ? '#262626' : 'transparent'}`,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#242424' : '#2a2a2a'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#1a1a1a' : '#111111'; }}
                  >
                    {copied
                      ? <><CheckCheck className="w-4 h-4" /> Copied!</>
                      : <><Copy className="w-4 h-4" /> Copy Prompt</>
                    }
                  </button>

                  {/* Download Skill */}
                  <button
                    onClick={handleDownloadSkill}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all flex-1 justify-center"
                    style={{
                      color: isDark ? '#ffffff' : '#111111',
                      background: 'transparent',
                      border: `1px solid ${border}`,
                      fontWeight: 500,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <Download className="w-4 h-4" /> Download Skill
                  </button>

                  {/* Download Prompt — with dropdown */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShowDlDropdown(v => !v)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all w-full justify-center"
                      style={{
                        color: downloaded ? text : muted,
                        background: 'transparent',
                        border: `1px solid ${border}`,
                        fontWeight: 500,
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; (e.currentTarget as HTMLButtonElement).style.color = text; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = downloaded ? text : muted; }}
                    >
                      {downloaded
                        ? <><CheckCheck className="w-4 h-4" /> Downloaded</>
                        : <><Download className="w-4 h-4" /> Download</>
                      }
                      <ChevronDown className="w-3.5 h-3.5 ml-auto" style={{ transform: showDlDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
                    </button>

                    {showDlDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowDlDropdown(false)} />
                        <div
                          className="absolute bottom-full mb-2 left-0 right-0 rounded-xl overflow-hidden z-20 flex flex-col"
                          style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                        >
                          {[
                            { label: 'Download as .txt', ext: 'txt' as const },
                            { label: 'Download as .md',  ext: 'md'  as const },
                            { label: 'Download as PDF',  ext: 'pdf' as const },
                            { label: 'Download as .docx', ext: 'docx' as const },
                          ].map(opt => (
                            <button
                              key={opt.ext}
                              onClick={() => handleDownload(opt.ext)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors whitespace-nowrap"
                              style={{ color: text, background: 'transparent' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            >
                              <FileText className="w-4 h-4" style={{ color: muted }} />
                              {opt.label.replace(' as ', ' ')}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* How to use */}
                <div
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{ background: cardBg, border: `1px solid ${border}` }}
                >
                  <p className="text-xs uppercase tracking-widest" style={{ color: isDark ? 'rgba(255,255,255,0.28)' : '#9ca3af', fontWeight: 600 }}>
                    How to use
                  </p>

                  {/* Video thumbnail */}
                  <div className="relative overflow-hidden rounded-xl w-full" style={{ aspectRatio: '16 / 9' }}>
                    <img
                      src="https://images.unsplash.com/photo-1720962158812-d16549f1e5a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3JlZW4lMjByZWNvcmRpbmclMjB0dXRvcmlhbCUyMGRhcmslMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzcyNjc0NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="How to use this prompt"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.32)' }}>
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.28)' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M4 2.5L11.5 7L4 11.5V2.5Z" fill="white" />
                        </svg>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] tabular-nums"
                      style={{ background: 'rgba(0,0,0,0.65)', color: '#fff', fontWeight: 500 }}
                    >
                      1:24
                    </div>
                  </div>

                  <ol className="flex flex-col gap-2 pl-4" style={{ listStyleType: 'decimal' }}>
                    {[
                      'Copy or download the prompt above.',
                      'Open your preferred AI tool (ChatGPT, Claude, Gemini, etc.).',
                      'Paste the prompt and replace [TRANSCRIPT] with your transcript text.',
                      'Run and iterate — adjust tone or length as needed.',
                    ].map((step, i) => (
                      <li key={i} className="text-xs" style={{ color: muted, lineHeight: 1.7 }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* ── Right: Related prompts ───────────────────────────────── */}
              {related.length > 0 && (
                <>
                  {/* Vertical divider */}
                  <div className="flex-shrink-0 self-stretch w-px" style={{ background: border }} />

                  <aside className="flex-shrink-0 flex flex-col gap-4 pb-8 px-5 overflow-y-auto overscroll-contain h-full prompt-aside-scroll" style={{ width: 260, scrollbarWidth: 'none' }}>
                    <style>{`.prompt-aside-scroll::-webkit-scrollbar { display: none; }`}</style>
                    
                    <div className="flex flex-col gap-2">
                      {related.map(rel => {
                        const relCol = CATEGORY_COLORS[rel.category];
                        return (
                          null
                        );
                      })}
                    </div>

                    {/* Similar prompts — tag-matched first, then falls back to other-category prompts */}
                    {(() => {
                      const similarList = similar.length > 0
                        ? similar
                        : PROMPTS.filter(p => p.category !== prompt.category && p.id !== prompt.id).slice(0, 3);
                      if (similarList.length === 0) return null;
                      return (
                        <>
                          
                          <p className="text-xs uppercase tracking-widest" style={{ color: isDark ? 'rgba(255,255,255,0.28)' : '#9ca3af', fontWeight: 600 }}>
                            Must try prompts
                          </p>

                          {/* Tabs */}
                          <div className="flex items-center gap-0.5" style={{ borderBottom: `1px solid ${border}`, marginBottom: 2 }}>
                            {([
                              { key: 'recent',  label: 'Most Recent' },
                              { key: 'related', label: 'Related'     },
                              { key: 'viral',   label: 'Viral'       },
                            ] as const).map(tab => (
                              <button
                                key={tab.key}
                                onClick={() => setSimilarTab(tab.key)}
                                className="flex-1 flex items-center justify-center gap-1 px-1 py-2 text-[11px] rounded-none transition-colors border-b-2 -mb-px"
                                style={{
                                  background: 'transparent',
                                  borderBottomColor: similarTab === tab.key ? '#00b8b2' : 'transparent',
                                  color: similarTab === tab.key ? text : muted,
                                  fontWeight: similarTab === tab.key ? 600 : 400,
                                  minWidth: 0,
                                }}
                              >
                                <span className="truncate">{tab.label}</span>
                                
                              </button>
                            ))}
                          </div>

                          <div className="flex flex-col gap-2">
                            {similarList
                              .slice()
                              .sort((a, b) => {
                                if (similarTab === 'recent') return b.id - a.id;
                                if (similarTab === 'viral')  return b.uses - a.uses;
                                return 0; // related — keep original order
                              })
                              .slice(0, 3)
                              .map(sim => {
                                const simCol = CATEGORY_COLORS[sim.category];
                                return (
                                  <button
                                    key={sim.id}
                                    className="flex flex-col gap-1.5 p-3 rounded-xl text-left transition-colors w-full"
                                    style={{ background: 'transparent', border: `1px solid ${border}` }}
                                    onClick={() => navigate(`/prompt-base/${sim.id}`, { state: { prompt: sim } })}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px]"
                                        style={{ background: isDark ? simCol.darkBg : simCol.bg, color: isDark ? simCol.darkText : simCol.text, fontWeight: 600 }}
                                      >
                                        {CATEGORY_ICONS[sim.category]}
                                        {sim.category}
                                      </span>
                                      <span className="text-[10px]" style={{ color: muted }}>{(sim.uses / 1000).toFixed(1)}k</span>
                                    </div>
                                    <p className="text-xs" style={{ color: text, fontWeight: 600, lineHeight: 1.4 }}>{sim.title}</p>
                                    <p className="text-[11px]" style={{ color: muted, lineHeight: 1.5 }}>{sim.description}</p>
                                  </button>
                                );
                              })}
                          </div>
                        </>
                      );
                    })()}

                    {/* ── Most Recent Transcripts ── */}
                    <div style={{ borderTop: `1px solid ${border}`, marginTop: 4 }} />
                    <p className="text-xs uppercase tracking-widest" style={{ color: isDark ? 'rgba(255,255,255,0.28)' : '#9ca3af', fontWeight: 600 }}>
                      Most Recent Transcripts
                    </p>

                    <div className="flex flex-col gap-2">
                      {MY_HISTORY.slice(0, 4).map(entry => (
                        <SidebarTranscriptCard
                          key={entry.id}
                          entry={entry}
                          isDark={isDark}
                          border={border}
                          text={text}
                          muted={muted}
                          hoverBg={hoverBg}
                          onClick={() => navigate('/discover')}
                        />
                      ))}
                    </div>

                    <button
                      className="text-xs transition-colors flex items-center gap-1"
                      style={{ color: muted }}
                      onClick={() => navigate('/discover')}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = text)}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = muted)}
                    >
                      View more in Discover →
                    </button>

                    {/* ── Cross-navigation: Explore Platform ── */}
                    <div style={{ borderTop: `1px solid ${border}`, marginTop: 4 }} />
                    
                    <div className="flex flex-col gap-2">
                      {[
                        { label: 'Dashboard', sub: 'Your transcript library', path: '/dashboard', icon: '▦' },
                        { label: 'Discover', sub: 'Trending transcripts', path: '/discover', icon: '◎' },
                        { label: 'New Transcription', sub: 'Transcribe a new video', path: '/new', icon: '+' },
                      ].map(item => (
                        null
                      ))}
                    </div>
                  </aside>
                </>
              )}


            </div>
          </div>
        </main>
      </div>
    </div>
  );
}