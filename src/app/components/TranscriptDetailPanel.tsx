/**
 * TranscriptDetailPanel
 * ─────────────────────
 * Shared component used by DashboardPage (singles library) and DiscoverPage.
 * Matches the exact layout of the inline detail view inside the logged-in app.
 * Edit this file once → every surface that shows a transcript updates.
 */
import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router';
import { formatDuration } from '../utils/formatDuration';
import {
  Heart, Clock, Globe, Calendar, Download, ExternalLink, Copy, CheckCheck,
  RefreshCw, ChevronDown, Eye, CheckCircle2, ArrowLeft,
  Sparkles, ArrowRight, FileText, Search, Mail, Twitter, Youtube, Megaphone,
  MoreHorizontal, Share2, Bookmark, Link, Flag, Lock,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TranscriptDetailVideo {
  title: string;
  creator: string;
  platform?: string;
  likes: string;
  duration: string;
  language: string;
  date: string;
  wordCount: number;
  charCount: number;
  sentences: number;
  readability: string;
  thumbnail: string;
  avatar: string;
}

export interface RelatedVideo {
  title: string;
  creator: string;
  duration: string;
  views: string;
  thumb: string;
}

export interface DownloadFormat {
  label: string;
  free: boolean;
}

interface TranscriptDetailPanelProps {
  video: TranscriptDetailVideo;
  transcript: string[];
  related: RelatedVideo[];
  downloadFormats: DownloadFormat[];
  /** Theme tokens — passed from parent so the panel matches the surrounding page */
  isDark: boolean;
  bg: string;
  border: string;
  text: string;
  muted: string;
  hoverBg: string;
  cardBg: string;
  /** When provided a ← back arrow appears in the detail header */
  onBack?: () => void;
  /** Navigate to the creator's profile page */
  onViewCreator?: (creator: string) => void;
  /** Free / Pro plan — gates partial transcript + premium tabs */
  plan?: 'free' | 'pro';
  onUpgrade?: () => void;
}

// ─── Inline prompt detail (rendered inside Prompts tab) ───────────────────────
function InlinePromptDetail({
  prompt,
  videoTitle,
  isDark,
  border,
  text,
  muted,
  hoverBg,
  onBack,
}: {
  prompt: TranscriptPrompt;
  videoTitle: string;
  isDark: boolean;
  border: string;
  text: string;
  muted: string;
  hoverBg: string;
  onBack: () => void;
}) {
  const [inlineCopied, setInlineCopied] = useState(false);
  const [showDlDropdown, setShowDlDropdown] = useState(false);
  const [dlDone, setDlDone] = useState(false);
  const [skillDone, setSkillDone] = useState(false);
  const fullPrompt = prompt.prompt.replace('[PASTE TRANSCRIPT HERE]', `[Transcript from "${videoTitle}"]`);
  const slug = prompt.label.toLowerCase().replace(/\s+/g, '-');

  const handleInlineCopy = () => {
    navigator.clipboard.writeText(fullPrompt).catch(() => {});
    setInlineCopied(true);
    setTimeout(() => setInlineCopied(false), 2000);
  };

  const handleDownloadSkill = () => {
    const content = JSON.stringify({ id: prompt.id, label: prompt.label, category: prompt.category, prompt: fullPrompt }, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-skill.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSkillDone(true);
    setTimeout(() => setSkillDone(false), 2000);
  };

  const handleDownload = (format: 'txt' | 'md' | 'pdf' | 'docx') => {
    if (format === 'pdf') {
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`<!DOCTYPE html><html><head><title>${prompt.label}</title><style>body{font-family:sans-serif;max-width:700px;margin:48px auto;color:#111}h1{font-size:1.4rem;margin-bottom:8px}pre{white-space:pre-wrap;word-break:break-word;font-size:0.85rem;color:#444;background:#f9fafb;padding:16px;border-radius:8px}</style></head><body><h1>${prompt.label}</h1><p>${prompt.description}</p><h2>Prompt</h2><pre>${fullPrompt}</pre></body></html>`);
        win.document.close();
        win.focus();
        win.print();
      }
    } else if (format === 'docx') {
      const content = `${prompt.label}\n\n${prompt.description}\n\nPrompt\n------\n${fullPrompt}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${slug}.docx`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const content = format === 'md'
        ? `# ${prompt.label}\n\n${prompt.description}\n\n## Prompt\n\n\`\`\`\n${fullPrompt}\n\`\`\``
        : fullPrompt;
      const mime = format === 'md' ? 'text/markdown' : 'text/plain';
      const blob = new Blob([content], { type: `${mime};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${slug}.${format}`; a.click();
      URL.revokeObjectURL(url);
    }
    setShowDlDropdown(false);
    setDlDone(true);
    setTimeout(() => setDlDone(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        className="flex items-center gap-1.5 text-[11px] transition-colors self-start"
        style={{ color: muted }}
        onClick={onBack}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = text)}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = muted)}
      >
        <ArrowLeft className="w-3 h-3" />
        Back to prompts
      </button>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] px-2 py-0.5 rounded-full self-start" style={{ color: prompt.iconColor, background: `${prompt.iconColor}18`, fontWeight: 600 }}>
          {prompt.category}
        </span>
        <p className="text-sm" style={{ color: text, fontWeight: 700, lineHeight: 1.35 }}>{prompt.label}</p>
        <p className="text-[11px]" style={{ color: muted, lineHeight: 1.6 }}>{prompt.description}</p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
        <div className="flex items-center px-3.5 py-2" style={{ borderBottom: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
          <span className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Prompt</span>
        </div>
        <pre
          className="px-3.5 py-3 text-[11px] leading-relaxed whitespace-pre-wrap break-words overflow-y-auto"
          style={{
            color: isDark ? 'rgba(255,255,255,0.75)' : '#374151',
            fontFamily: 'inherit',
            maxHeight: 220,
            background: isDark ? '#0d0d0d' : '#f9fafb',
            scrollbarWidth: 'thin',
          }}
        >
          {fullPrompt}
        </pre>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Copy */}
        <button
          onClick={handleInlineCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all flex-1 justify-center"
          style={{ background: isDark ? '#1a1a1a' : '#111111', color: '#ffffff', fontWeight: 500, border: `1px solid ${isDark ? '#262626' : 'transparent'}` }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#242424' : '#2a2a2a'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#1a1a1a' : '#111111'; }}
        >
          {inlineCopied ? <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
          <span>{inlineCopied ? 'Copied!' : 'Copy'}</span>
        </button>

        {/* Skill */}
        <button
          onClick={handleDownloadSkill}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all flex-1 justify-center"
          style={{ color: text, background: 'transparent', border: `1px solid ${border}`, fontWeight: 500 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          {skillDone ? <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" /> : <Download className="w-3.5 h-3.5 flex-shrink-0" />}
          <span>{skillDone ? 'Saved!' : 'Skill'}</span>
        </button>

        {/* Download dropdown */}
        <div className="relative flex-none">
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all whitespace-nowrap justify-center"
            style={{ color: text, background: 'transparent', border: `1px solid ${border}`, fontWeight: 500 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            onClick={() => setShowDlDropdown(v => !v)}
          >
            {dlDone ? <CheckCheck className="w-3.5 h-3.5 flex-shrink-0" /> : <Download className="w-3.5 h-3.5 flex-shrink-0" />}
            <span>{dlDone ? 'Done!' : 'Download'}</span>
            <ChevronDown className="w-2.5 h-2.5 flex-shrink-0" style={{ transform: showDlDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
          </button>

          {showDlDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDlDropdown(false)} />
              <div
                className="absolute bottom-full mb-1.5 right-0 rounded-xl overflow-hidden z-20 flex flex-col"
                style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', minWidth: 152 }}
              >
                {([
                  { label: 'Download .txt',  ext: 'txt'  as const },
                  { label: 'Download .md',   ext: 'md'   as const },
                  { label: 'Download .pdf',  ext: 'pdf'  as const },
                  { label: 'Download .docx', ext: 'docx' as const },
                ]).map(opt => (
                  <button
                    key={opt.ext}
                    onClick={() => handleDownload(opt.ext)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors whitespace-nowrap w-full"
                    style={{ color: isDark ? '#ffffff' : '#111111', background: 'transparent' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <FileText className="w-3 h-3 flex-shrink-0" style={{ color: muted }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function displayNameFromHandle(handle: string): string {
  return handle
    .replace(/^@/, '')
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─── Component ────────────────────────────────────────────────────────────────
export function TranscriptDetailPanel({
  video,
  transcript,
  related,
  downloadFormats,
  isDark,
  bg,
  border,
  text,
  muted,
  hoverBg,
  cardBg,
  onBack,
  onViewCreator,
  plan,
  onUpgrade,
}: TranscriptDetailPanelProps) {
  const isFree = plan === 'free';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'transcript' | 'caption' | 'analytics' | 'prompts'>('transcript');
  const [langOpen, setLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<TranscriptPrompt | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript.join('\n\n')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ── Detail header ───────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-5 h-[52px] flex-shrink-0"
        style={{ borderBottom: `1px solid ${border}` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="flex-shrink-0 p-1 rounded-md transition-colors"
              style={{ color: muted }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <nav className="flex items-center gap-1 text-xs min-w-0" aria-label="Breadcrumb">
            {onBack ? (
              <button
                onClick={onBack}
                className="flex-shrink-0 transition-colors whitespace-nowrap text-[12px]"
                style={{ color: muted }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = text)}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = muted)}
              >
                Library
              </button>
            ) : (
              <span className="flex-shrink-0 whitespace-nowrap" style={{ color: muted }}>Library</span>
            )}
            <span className="flex-shrink-0 px-0.5" style={{ color: muted }}>›</span>
            <span className="truncate" style={{ color: text, fontWeight: 500 }}>{video.title}</span>
          </nav>
        </div>

        {/* ── Header right: favourite + more menu ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Favourite */}
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors"
            style={{
              color: favourited ? '#ef4444' : muted,
              background: favourited
                ? (isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.07)')
                : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
              border: `1px solid ${favourited ? 'rgba(239,68,68,0.28)' : border}`,
            }}
            onClick={() => setFavourited(v => !v)}
            title={favourited ? 'Remove from favourites' : 'Add to favourites'}
            onMouseEnter={ev => { if (!favourited) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
            onMouseLeave={ev => { if (!favourited) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
          >
            <Heart className="w-3.5 h-3.5" style={{ fill: favourited ? '#ef4444' : 'none' }} />
            {favourited ? 'Saved' : 'Save'}
          </button>

          {/* More ⋯ */}
          <div className="relative">
            <button
              className="p-1.5 rounded-lg transition-colors"
              style={{
                color: showMoreMenu ? text : muted,
                background: showMoreMenu ? (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                border: `1px solid ${border}`,
              }}
              onClick={() => setShowMoreMenu(v => !v)}
              title="More options"
              onMouseEnter={ev => { if (!showMoreMenu) (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
              onMouseLeave={ev => { if (!showMoreMenu) (ev.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                <div
                  className="absolute top-full right-0 mt-1.5 rounded-xl overflow-hidden z-50 py-1 flex flex-col"
                  style={{ background: isDark ? '#1a1a1a' : '#ffffff', border: `1px solid ${border}`, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', minWidth: 200 }}
                >
                  {/* Section: Actions */}
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Actions</span>
                  </div>
                  {[
                    {
                      label: favourited ? 'Remove from saved' : 'Save to favourites',
                      icon: <Heart className="w-3.5 h-3.5" style={{ fill: favourited ? '#ef4444' : 'none', color: favourited ? '#ef4444' : 'inherit' }} />,
                      action: () => { setFavourited(v => !v); setShowMoreMenu(false); },
                    },
                    {
                      label: 'Save to folder',
                      icon: <Bookmark className="w-3.5 h-3.5" />,
                      action: () => setShowMoreMenu(false),
                    },
                    {
                      label: copied ? 'Transcript copied!' : 'Copy transcript',
                      icon: copied ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#00b8b2' }} /> : <Copy className="w-3.5 h-3.5" />,
                      action: () => { navigator.clipboard.writeText(transcript.join('\n\n')).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); setShowMoreMenu(false); },
                    },
                    {
                      label: linkCopied ? 'Link copied!' : 'Copy link',
                      icon: linkCopied ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#00b8b2' }} /> : <Link className="w-3.5 h-3.5" />,
                      action: () => { navigator.clipboard.writeText(window.location.href).catch(() => {}); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); setShowMoreMenu(false); },
                    },
                  ].map(item => (
                    <button
                      key={item.label}
                      className="flex items-center gap-2.5 px-3 py-2 text-[12px] w-full text-left transition-colors"
                      style={{ color: muted, background: 'transparent' }}
                      onClick={item.action}
                      onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; (ev.currentTarget as HTMLButtonElement).style.color = text; }}
                      onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.color = muted; }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}

                  {/* Divider */}
                  <div className="my-1 mx-3 h-px" style={{ background: border }} />

                  {/* Section: Share */}
                  <div className="px-3 pt-1 pb-1">
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Share to</span>
                  </div>
                  {[
                    { label: 'Share on X / Twitter', icon: <Twitter className="w-3.5 h-3.5" /> },
                    { label: 'Share on YouTube',     icon: <Youtube className="w-3.5 h-3.5" /> },
                    { label: 'Send via email',        icon: <Mail className="w-3.5 h-3.5" /> },
                    { label: 'Share link',            icon: <Share2 className="w-3.5 h-3.5" /> },
                  ].map(item => (
                    <button
                      key={item.label}
                      className="flex items-center gap-2.5 px-3 py-2 text-[12px] w-full text-left transition-colors"
                      style={{ color: muted, background: 'transparent' }}
                      onClick={() => setShowMoreMenu(false)}
                      onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; (ev.currentTarget as HTMLButtonElement).style.color = text; }}
                      onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.color = muted; }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}

                  {/* Divider */}
                  <div className="my-1 mx-3 h-px" style={{ background: border }} />

                  {/* Section: Download */}
                  <div className="px-3 pt-1 pb-1">
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Download</span>
                  </div>
                  {downloadFormats.map(fmt => (
                    <button
                      key={fmt.label}
                      className="flex items-center gap-2.5 px-3 py-2 text-[12px] w-full text-left transition-colors"
                      style={{ color: muted, background: 'transparent' }}
                      onClick={() => setShowMoreMenu(false)}
                      onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = hoverBg; (ev.currentTarget as HTMLButtonElement).style.color = text; }}
                      onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; (ev.currentTarget as HTMLButtonElement).style.color = muted; }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      {fmt.label}
                    </button>
                  ))}

                  {/* Divider */}
                  <div className="my-1 mx-3 h-px" style={{ background: border }} />

                  {/* Danger */}
                  <button
                    className="flex items-center gap-2.5 px-3 py-2 text-[12px] w-full text-left transition-colors"
                    style={{ color: '#ef4444', background: 'transparent' }}
                    onClick={() => setShowMoreMenu(false)}
                    onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
                    onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Report transcript
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Detail content ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col min-h-full">

          {/* ── Video info card ── */}
          <div className="flex justify-center px-6 py-5">
            <div className="flex items-center gap-4 w-full">

                {/* Thumbnail */}
                <div
                  className="relative flex-shrink-0 rounded-xl overflow-hidden"
                  style={{ width: 112, aspectRatio: '9/16' }}
                >
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                      <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                        <path d="M3.5 2.5L11.5 7L3.5 11.5V2.5Z" fill="#111827" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <p style={{ color: text, fontWeight: 600, fontSize: '1rem', lineHeight: 1.3 }}>
                      {video.title}
                    </p>
                    <a
                      href="#"
                      className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] mt-0.5 transition-opacity hover:opacity-70"
                      style={{
                        color: muted,
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      }}
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      {video.platform ?? 'TikTok'}
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={video.avatar}
                        alt="creator"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="text-xs" style={{ color: muted }}>{video.creator}</span>
                  </div>

                  <div
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]"
                    style={{ color: muted }}
                  >
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {video.likes} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDuration(video.duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {video.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {video.date}
                    </span>
                  </div>

                  <div
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]"
                    style={{ color: muted }}
                  >
                    <span><strong style={{ color: text }}>{video.wordCount}</strong> words</span>
                    <span><strong style={{ color: text }}>{video.charCount}</strong> characters</span>
                    <span><strong style={{ color: text }}>{video.sentences}</strong> sentences</span>
                    <span><strong style={{ color: text }}>{video.readability}</strong> : Readability</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Download HD Cover', 'Download Video'].map(label => (
                      <button
                        key={label}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors whitespace-nowrap"
                        style={{
                          color: muted,
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        }}
                        onMouseEnter={e =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)')
                        }
                        onMouseLeave={e =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')
                        }
                      >
                        <Download className="w-3 h-3" /> {label}
                      </button>
                    ))}
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-colors whitespace-nowrap"
                      style={{
                        color: muted,
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      }}
                      onMouseEnter={e =>
                        ((e.currentTarget as HTMLButtonElement).style.background =
                          isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)')
                      }
                      onMouseLeave={e =>
                        ((e.currentTarget as HTMLButtonElement).style.background =
                          isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')
                      }
                      onClick={() => navigate(`/profile/${video.creator.replace(/^@/, '')}`)}
                    >
                      <ExternalLink className="w-3 h-3" /> View more videos from this creator
                    </button>
                  </div>
                </div>
            </div>
          </div>

          {/* Full-width divider */}
          <div style={{ borderBottom: `1px solid ${border}` }} />

          {/* ── Split panel: Transcript + Download / Related ── */}
          <div className="flex flex-1 min-h-0 justify-center">
          <div className="flex w-full min-h-0" style={{ maxWidth: 1100 }}>

            {/* ── LEFT: Tabs + Transcript ── */}
            <div
              className="flex-1 flex flex-col min-w-0"
              style={{ paddingLeft: 32, paddingRight: 32 }}
            >
              {/* Tab bar */}
              <div
                className="flex items-center"
                style={{ borderBottom: `1px solid ${border}`, marginLeft: -32, marginRight: -32, paddingLeft: 32, paddingRight: 32 }}
              >
                <div className="flex">
                  {(['transcript', 'caption', 'analytics', 'prompts'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); if (tab !== 'prompts') setSelectedPrompt(null); }}
                      className="px-4 py-3 text-xs capitalize transition-colors border-b-2 -mb-px flex items-center gap-1.5"
                      style={{
                        borderBottomColor: activeTab === tab ? text : 'transparent',
                        color: activeTab === tab ? text : muted,
                        fontWeight: activeTab === tab ? 600 : 400,
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action bar — below tabs, above content, left-aligned */}
              {(activeTab === 'transcript' || activeTab === 'caption') && (
                <div className="flex items-center gap-2 px-4 py-1.5 mt-3">
                  {/* Retranslate */}
                  <div className="relative">
                    <button
                      onClick={() => setLangOpen(o => !o)}
                      className="flex items-center gap-1 p-0 rounded-md text-[12px] transition-colors"
                      style={{ color: muted }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = text; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Retranslate
                      <ChevronDown className={`w-2.5 h-2.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {langOpen && (
                      <div
                        className="absolute left-0 top-full mt-1 w-36 rounded-xl overflow-hidden z-50"
                        style={{ background: isDark ? '#141414' : '#fff', border: `1px solid ${border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
                      >
                        {['English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setLangOpen(false)}
                            className="w-full text-left px-3 py-2 text-[11px] transition-colors"
                            style={{ color: muted }}
                            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = hoverBg)}
                            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="w-px h-3 self-center" style={{ background: border }} />

                  {/* Copy */}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 p-0 rounded-md text-[12px] transition-colors"
                    style={{ color: copied ? '#00b8b2' : muted }}
                    onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = text; }}
                    onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                  >
                    {copied ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}

              {/* Tab content */}
              <div className="p-4" style={{ background: 'transparent' }}>
                {activeTab === 'transcript' && (
                  <div className="flex flex-col gap-3">
                    {transcript.map((para, i) => (
                      <p
                        key={i}
                        className="text-xs leading-relaxed"
                        style={{ color: text }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {activeTab === 'caption' && (
                  <div className="flex flex-col gap-4">
                    {/* Single caption block */}
                    <div
                      className="relative rounded-xl p-4"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.04)' : '#f9f9f9',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#ebebeb'}`,
                      }}
                    >
                      <p className="text-sm leading-relaxed pr-7" style={{ color: text }}>
                        Wait for the end... this one actually changed how I think about it 🤯 Drop a comment if you felt the same 👇
                      </p>
                      <button
                        className="absolute top-3 right-3"
                        onClick={() => navigator.clipboard.writeText("Wait for the end... this one actually changed how I think about it 🤯 Drop a comment if you felt the same 👇")}
                        title="Copy caption"
                      >
                        <Copy className="w-3.5 h-3.5" style={{ color: muted }} />
                      </button>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0' }} />

                    {/* Caption details grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {[
                        { label: 'Characters', value: '107' },
                        { label: 'Words', value: '22' },
                        { label: 'Tone', value: 'Engagement hook' },
                        { label: 'Best for', value: 'TikTok · Reels' },
                        { label: 'CTA type', value: 'Comment prompt' },
                        { label: 'Emojis', value: '2' },
                      ].map(d => (
                        <div key={d.label} className="flex flex-col gap-0.5">
                          <p className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>{d.label}</p>
                          <p className="text-xs" style={{ color: text }}>{d.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0' }} />

                    {/* Suggested hashtags */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Suggested hashtags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['#viral', '#foryou', '#fyp', '#trending', '#reels', '#explore'].map(tag => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded-md"
                            style={{
                              background: isDark ? 'rgba(255,255,255,0.06)' : '#efefef',
                              color: muted,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="relative">
                  {isFree && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl" style={{ background: isDark ? 'rgba(13,13,13,0.80)' : 'rgba(249,250,251,0.85)', backdropFilter: 'blur(3px)' }}>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: isDark ? '#1a1a1a' : '#f3f4f6', border: `1px solid ${border}` }}>
                        <Lock className="w-4 h-4" style={{ color: muted }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm" style={{ color: text, fontWeight: 600 }}>Analytics is Pro only</p>
                        <p className="text-xs mt-1" style={{ color: muted }}>Upgrade to unlock deep transcript insights</p>
                      </div>
                      <button
                        onClick={onUpgrade}
                        className="px-5 py-2 rounded-xl text-xs transition-opacity hover:opacity-80"
                        style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 600 }}
                      >
                        Upgrade to Pro
                      </button>
                    </div>
                  )}
                  <div className={isFree ? 'pointer-events-none select-none' : ''} style={{ filter: isFree ? 'blur(3px)' : 'none' }}>
                  <div className="flex flex-col gap-5">

                    {/* ── Transcript Statistics ── */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Transcript Statistics</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Total Words',      value: String(video.wordCount)   },
                          { label: 'Unique Words',     value: String(Math.round(video.wordCount * 0.61)) },
                          { label: 'Sentences',        value: String(video.sentences)   },
                          { label: 'Avg Word Length',  value: '4.2 chars'               },
                          { label: 'Avg Sentence',     value: `${(video.wordCount / Math.max(video.sentences,1)).toFixed(1)} words` },
                          { label: 'Vocab Richness',   value: '61.2%'                   },
                        ].map(m => (
                          <div key={m.label} className="p-3 rounded-xl flex flex-col gap-1" style={{ background: cardBg, border: `1px solid ${border}` }}>
                            <p className="text-base" style={{ color: text, fontWeight: 700, lineHeight: 1.2 }}>{m.value}</p>
                            <p className="text-[10px]" style={{ color: muted }}>{m.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Most Common Words ── */}
                    <div className="flex flex-col gap-2.5">
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Most Common Words</p>
                      {(() => {
                        const WORD_CONTEXTS: Record<string, string[]> = {
                          read:        ['"…you can **read** faster than you think once you train your brain…"', '"…I started to **read** at 2x speed and never looked back…"', '"…every book you want to **read** is now within reach…"'],
                          listen:      ['"…you can **listen** to any book while commuting…"', '"…I **listen** at three times the normal playback rate…"', '"…just **listen** and let the words flow naturally…"'],
                          speed:       ['"…the **speed** at which you consume content defines your output…"', '"…bump the **speed** up gradually until it feels natural…"', '"…**speed** reading and **speed** listening are different skills…"'],
                          book:        ['"…every **book** becomes accessible when you listen instead of read…"', '"…finish a **book** a week with this one habit…"'],
                          able:        ['"…you will be **able** to retain more at higher speeds…"', '"…once trained, you\'re **able** to follow complex arguments effortlessly…"'],
                          excuse:      ['"…there\'s no **excuse** not to learn with these tools available…"'],
                          application: ['"…this **application** changed how I consume information daily…"'],
                          called:      ['"…there\'s an app **called** Speechify that does exactly this…"'],
                          speechify:   ['"…**Speechify** reads any text aloud at your chosen speed…"'],
                          picture:     ['"…**picture** yourself getting through your reading list in a month…"'],
                        };
                        const WORDS = [
                          { word: 'read',        count: 3 },
                          { word: 'listen',      count: 3 },
                          { word: 'speed',       count: 3 },
                          { word: 'book',        count: 2 },
                          { word: 'able',        count: 2 },
                          { word: 'excuse',      count: 1 },
                          { word: 'application', count: 1 },
                          { word: 'called',      count: 1 },
                          { word: 'speechify',   count: 1 },
                          { word: 'picture',     count: 1 },
                        ];
                        const maxCount = 3;
                        return (
                          <>
                            <div className="flex flex-col gap-1.5">
                              {WORDS.map((item, i) => {
                                const pct = (item.count / maxCount) * 100;
                                const isActive = expandedWord === item.word;
                                return (
                                  <div
                                    key={item.word}
                                    className="flex items-center gap-3 rounded-lg px-1.5 -mx-1.5 cursor-pointer transition-all"
                                    style={{ background: isActive ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)') : 'transparent' }}
                                    onClick={() => setExpandedWord(isActive ? null : item.word)}
                                    title={`See "${item.word}" in context`}
                                  >
                                    <span className="text-[10px] w-5 text-right flex-shrink-0" style={{ color: muted }}>{i + 1}.</span>
                                    <span
                                      className="text-[11px] w-20 flex-shrink-0"
                                      style={{
                                        color: text,
                                        fontWeight: isActive ? 600 : 400,
                                        textDecoration: 'underline',
                                        textDecorationStyle: 'dotted',
                                        textUnderlineOffset: 3,
                                        textDecorationColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
                                      } as React.CSSProperties}
                                    >
                                      {item.word}
                                    </span>
                                    <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
                                      <div
                                        className="h-full rounded-md flex items-center justify-end pr-2 transition-all"
                                        style={{
                                          width: `${pct}%`,
                                          background: isActive
                                            ? (isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.22)')
                                            : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'),
                                          minWidth: 28,
                                        }}
                                      >
                                        <span className="text-[9px]" style={{ color: text, fontWeight: 600 }}>{item.count}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* ── Context drawer ── */}
                            {expandedWord && WORD_CONTEXTS[expandedWord] && (
                              <div
                                className="rounded-xl overflow-hidden"
                                style={{ border: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)' }}
                              >
                                {/* Drawer header */}
                                <div
                                  className="flex items-center justify-between px-3.5 py-2.5"
                                  style={{ borderBottom: `1px solid ${border}` }}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Uses of</span>
                                    <span
                                      className="text-[11px] px-2 py-0.5 rounded-md"
                                      style={{ color: text, fontWeight: 600, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', border: `1px solid ${border}` }}
                                    >
                                      "{expandedWord}"
                                    </span>
                                    <span className="text-[10px]" style={{ color: muted }}>
                                      {WORD_CONTEXTS[expandedWord].length} occurrence{WORD_CONTEXTS[expandedWord].length !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                  <button
                                    onClick={e => { e.stopPropagation(); setExpandedWord(null); }}
                                    className="w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0"
                                    style={{ color: muted, background: 'transparent' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = text; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                                    title="Close"
                                  >
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                  </button>
                                </div>

                                {/* Context snippets */}
                                <div className="flex flex-col">
                                  {WORD_CONTEXTS[expandedWord].map((ctx, ci) => {
                                    const parts = ctx.split(/\*\*(.*?)\*\*/g);
                                    return (
                                      <div
                                        key={ci}
                                        className="flex items-start gap-3 px-3.5 py-3"
                                        style={{ borderBottom: ci < WORD_CONTEXTS[expandedWord].length - 1 ? `1px solid ${border}` : 'none' }}
                                      >
                                        <span
                                          className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center text-[9px] mt-0.5"
                                          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', color: muted, fontWeight: 600 }}
                                        >
                                          {ci + 1}
                                        </span>
                                        <p className="text-[11px] leading-relaxed" style={{ color: muted }}>
                                          {parts.map((part, pi) =>
                                            pi % 2 === 1
                                              ? <mark key={pi} style={{ background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)', color: text, fontWeight: 600, borderRadius: 3, padding: '0 2px' }}>{part}</mark>
                                              : <span key={pi}>{part}</span>
                                          )}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* ── Common Phrases ── */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Common Phrases</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { phrase: 'the speed',      count: 3 },
                          { phrase: 'you can',        count: 2 },
                          { phrase: 'listen to',      count: 2 },
                          { phrase: 'read faster',    count: 1 },
                          { phrase: 'every book',     count: 1 },
                        ].map(p => (
                          <div key={p.phrase} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: cardBg, border: `1px solid ${border}` }}>
                            <span className="text-[11px]" style={{ color: text }}>{p.phrase}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md" style={{ color: muted, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}>{p.count}x</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Word Cloud ── */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: muted }}>Word Cloud</p>
                      <div className="rounded-xl p-4 flex flex-wrap gap-x-3 gap-y-2 items-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
                        {[
                          { word: 'read',        size: 22 },
                          { word: 'listen',      size: 20 },
                          { word: 'speed',       size: 20 },
                          { word: 'book',        size: 16 },
                          { word: 'able',        size: 15 },
                          { word: 'excuse',      size: 13 },
                          { word: 'application', size: 12 },
                          { word: 'called',      size: 12 },
                          { word: 'speechify',   size: 12 },
                          { word: 'picture',     size: 12 },
                          { word: 'fast',        size: 11 },
                          { word: 'goes',        size: 11 },
                          { word: 'times',       size: 11 },
                          { word: 'moment',      size: 11 },
                          { word: 'modify',      size: 11 },
                          { word: 'never',       size: 11 },
                          { word: 'listened',    size: 11 },
                          { word: 'quickly',     size: 11 },
                          { word: 'attention',   size: 11 },
                          { word: 'accelerate',  size: 11 },
                        ].map(w => (
                          <span
                            key={w.word}
                            style={{
                              fontSize: w.size,
                              color: text,
                              opacity: 0.4 + (w.size - 11) / 11 * 0.6,
                              fontWeight: w.size >= 18 ? 700 : w.size >= 14 ? 600 : 400,
                              lineHeight: 1.3,
                            }}
                          >
                            {w.word}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                  </div>
                  </div>
                )}

                {activeTab === 'prompts' && !selectedPrompt && (
                  <div className="flex flex-col gap-4 p-4" style={{ background: 'transparent' }}>
                    {/* Intro line */}
                    <p className="text-[11px]" style={{ color: muted }}>
                      Prompts tailored to this transcript — click any card to use it without leaving.
                    </p>

                    {/* Prompt cards — 4 in a 2×2 grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {TRANSCRIPT_PROMPTS.slice(0, 4).map((prompt) => (
                        <PromptCard
                          key={prompt.id}
                          prompt={prompt}
                          isDark={isDark}
                          border={border}
                          text={text}
                          muted={muted}
                          hoverBg={hoverBg}
                          cardBg={cardBg}
                          videoTitle={video.title}
                          onSelect={() => setSelectedPrompt(prompt)}
                        />
                      ))}
                    </div>

                    {/* View more → Prompt Base */}
                    <button
                      onClick={() => navigate('/prompt-base')}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs transition-colors"
                      style={{
                        color: muted,
                        border: `1px solid ${border}`,
                        background: 'transparent',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
                        (e.currentTarget as HTMLButtonElement).style.color = text;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = muted;
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      View all prompts in Prompt Base
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {activeTab === 'prompts' && selectedPrompt && (
                  <InlinePromptDetail
                    prompt={selectedPrompt}
                    videoTitle={video.title}
                    isDark={isDark}
                    border={border}
                    text={text}
                    muted={muted}
                    hoverBg={hoverBg}
                    onBack={() => setSelectedPrompt(null)}
                  />
                )}
              </div>
            </div>

            {/* Vertical divider */}
            <div
              className="flex-shrink-0 self-stretch"
              style={{ width: 1, background: border }}
            />

            {/* ── RIGHT: Download Transcript + Related Videos ── */}
            <div className="flex-shrink-0 flex flex-col gap-4" style={{ width: 280 }}>

              {/* Download Transcript */}
              <div className="rounded-2xl p-4" style={{ background: 'transparent' }}>
                <p className="text-xs mb-3" style={{ color: text, fontWeight: 600 }}>
                  Download Transcript
                </p>
                <div className="flex flex-col gap-1.5">
                  {downloadFormats.map(fmt => (
                    <button
                      key={fmt.label}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-left transition-colors"
                      style={{
                        color: text,
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = isDark
                          ? 'rgba(255,255,255,0.09)'
                          : 'rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = isDark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.04)';
                      }}
                    >
                      <Download className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="flex-1">{fmt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* About the Creator */}
              <div className="mx-4 rounded-2xl p-4 flex flex-col gap-4" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: muted, fontWeight: 600 }}>About the Creator</p>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ border: `2px solid ${border}` }}>
                    <img src={video.avatar} alt={video.creator} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <p className="text-sm truncate" style={{ color: text, fontWeight: 700 }}>
                      {displayNameFromHandle(video.creator)}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: muted }}>
                      {video.creator.startsWith('@') ? video.creator : `@${video.creator}`}
                    </p>
                  </div>
                </div>
                <button
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] transition-colors"
                  style={{
                    color: text,
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    border: `1px solid ${border}`,
                  }}
                  onClick={() => navigate(`/profile/${video.creator.replace(/^@/, '')}`)}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')}
                >
                  View all transcripts
                </button>
              </div>

              {/* Related Videos */}
              <div className="mx-4 rounded-2xl p-4" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                <p className="text-xs mb-3" style={{ color: text, fontWeight: 600 }}>
                  Related Videos
                </p>
                <div className="flex flex-col gap-1.5">
                  {(related.filter(v => v.creator === video.creator).length > 0
                    ? related.filter(v => v.creator === video.creator)
                    : related
                  ).map(vid => (
                    <div
                      key={vid.title}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
                      style={{ background: 'transparent' }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.background = isDark
                          ? 'rgba(255,255,255,0.07)'
                          : 'rgba(0,0,0,0.05)')
                      }
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        className="relative rounded-md overflow-hidden flex-shrink-0"
                        style={{ width: 36, aspectRatio: '9/16' }}
                      >
                        <ImageWithFallback
                          src={vid.thumb}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <p
                          className="text-[11px] leading-snug truncate"
                          style={{ color: text }}
                        >
                          {vid.title}
                        </p>
                        <span
                          className="flex items-center gap-2 text-[10px] flex-shrink-0"
                          style={{ color: muted }}
                        >
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-2.5 h-2.5" />
                            {vid.views}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {formatDuration(vid.duration)}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>{/* end right column */}
          </div>{/* end max-width wrapper */}
          </div>{/* end split panel */}

        </div>
      </div>
    </>
  );
}

// ─── Prompt data ──────────────────────────────────────────────────────────────
interface TranscriptPrompt {
  id: string;
  category: string;
  label: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  iconColor: string;
}

const TRANSCRIPT_PROMPTS: TranscriptPrompt[] = [
  {
    id: 'script',
    category: 'Script Writing',
    label: 'Write a video script',
    description: 'Turn this transcript into a polished, hook-first short-form script.',
    prompt: `Using the transcript below as source material, write a compelling [30/60]-second short-form video script. Open with a strong hook in the first 3 seconds, keep the pacing fast, and end with a clear call to action. Match the tone of the original creator.\n\nTranscript:\n[PASTE TRANSCRIPT HERE]`,
    icon: <FileText className="w-3.5 h-3.5" />,
    iconColor: '#818cf8',
  },
  {
    id: 'blog',
    category: 'SEO Blog Post',
    label: 'Write an SEO blog post',
    description: 'Expand the transcript into a long-form article optimised for search.',
    prompt: `Transform the following transcript into a 1,200-word SEO blog post. Include: an engaging title with the target keyword, a meta description (155 chars), H2 subheadings every ~300 words, a FAQ section with 3 questions from the content, and a conclusion with a CTA.\n\nTranscript:\n[PASTE TRANSCRIPT HERE]`,
    icon: <Search className="w-3.5 h-3.5" />,
    iconColor: '#34d399',
  },
  {
    id: 'thread',
    category: 'Social Media',
    label: 'Write a Twitter/X thread',
    description: 'Break the key insights into an engaging tweet-by-tweet thread.',
    prompt: `Convert the key ideas in this transcript into a 10-tweet Twitter/X thread. Tweet 1 should be the bold hook. Tweets 2–9 expand on the main points with one insight each. Tweet 10 is a summary with a CTA. Keep each tweet under 280 characters. Use numbered formatting (1/, 2/, ...).\n\nTranscript:\n[PASTE TRANSCRIPT HERE]`,
    icon: <Twitter className="w-3.5 h-3.5" />,
    iconColor: '#38bdf8',
  },
  {
    id: 'email',
    category: 'Email Newsletter',
    label: 'Write a newsletter section',
    description: 'Summarise the transcript into a digestible newsletter-ready block.',
    prompt: `Summarise this video transcript into a newsletter section. Include: a punchy subject-line suggestion, 2–3 sentence intro, 3 bullet-point takeaways, a relevant quote pulled from the transcript, and a "Watch the full video" CTA link placeholder.\n\nTranscript:\n[PASTE TRANSCRIPT HERE]`,
    icon: <Mail className="w-3.5 h-3.5" />,
    iconColor: '#fb923c',
  },
  {
    id: 'linkedin',
    category: 'Social Media',
    label: 'Write a LinkedIn post',
    description: 'Reframe the transcript as a thought-leadership LinkedIn post.',
    prompt: `Turn this video transcript into a high-performing LinkedIn post. Start with a curiosity-driven opener (no "I" as the first word). Share the core insight as a personal story or observation. Use short paragraphs. End with a question that invites comments. Aim for 150–200 words.\n\nTranscript:\n[PASTE TRANSCRIPT HERE]`,
    icon: <Megaphone className="w-3.5 h-3.5" />,
    iconColor: '#60a5fa',
  },
  {
    id: 'youtube',
    category: 'YouTube',
    label: 'Write a YouTube description',
    description: 'Create a keyword-rich description with timestamps and links.',
    prompt: `Write a YouTube video description based on this transcript. Include: an engaging first 2 lines (shown before "Show more"), a 100-word summary, 5–7 chapter timestamps with approximate times, 10 relevant hashtags, and a subscribe + social links placeholder section.\n\nTranscript:\n[PASTE TRANSCRIPT HERE]`,
    icon: <Youtube className="w-3.5 h-3.5" />,
    iconColor: '#f87171',
  },
];

// ─── PromptCard ───────────────────────────────────────────────────────────────
function PromptCard({
  prompt,
  isDark,
  border,
  text,
  muted,
  hoverBg,
  cardBg,
  videoTitle,
  onSelect,
}: {
  prompt: TranscriptPrompt;
  isDark: boolean;
  border: string;
  text: string;
  muted: string;
  hoverBg: string;
  cardBg: string;
  videoTitle: string;
  onSelect?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied,   setCopied]   = useState(false);

  const fullPrompt = prompt.prompt.replace('[PASTE TRANSCRIPT HERE]', `[Transcript from "${videoTitle}"]`);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        border: `1px solid ${border}`,
        background: cardBg,
      }}
    >
      {/* Card body */}
      <div className="flex flex-col gap-3 p-3.5 flex-1">
        {/* Icon + category row */}
        <div className="flex items-center justify-between gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: muted }}
          >
            {prompt.icon}
          </div>
          <span
            className="text-[9px] px-2 py-0.5 rounded-full truncate"
            style={{
              color: muted,
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {prompt.category}
          </span>
        </div>

        {/* Title + description */}
        <div className="flex flex-col gap-1">
          <p className="text-xs" style={{ color: text, fontWeight: 600, lineHeight: 1.4 }}>
            {prompt.label}
          </p>
          <p className="text-[10px]" style={{ color: muted, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
            {prompt.description}
          </p>
        </div>
      </div>

      {/* Expanded prompt text */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${border}` }}>
          <pre
            className="px-3.5 py-3 text-[10px] leading-relaxed whitespace-pre-wrap break-words"
            style={{
              color: muted,
              fontFamily: 'inherit',
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            }}
          >
            {fullPrompt}
          </pre>
        </div>
      )}

      {/* Action row */}
      <div
        className="flex items-center gap-1.5 px-3 py-2"
        style={{ borderTop: `1px solid ${border}` }}
      >
        <button
          onClick={() => onSelect?.()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] transition-colors flex-1 justify-center"
          style={{
            color: text,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            fontWeight: 500,
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')}
        >
          <ArrowRight className="w-3 h-3" /> Use prompt
        </button>

        <button
          onClick={() => setExpanded(x => !x)}
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors flex-shrink-0"
          style={{ color: muted, background: 'transparent' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; (e.currentTarget as HTMLButtonElement).style.color = text; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = muted; }}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}