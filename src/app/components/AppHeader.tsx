import React, { useContext, useRef, useState } from 'react';
import { Sun, Moon, Bell, Zap } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import Rd from '../../imports/Rd';
import { NotificationsDropdown } from './NotificationsDropdown';
import { useExtensionModal } from '../context/ChromeExtensionModalContext';

interface AppHeaderProps {
  leftSlot?: React.ReactNode;
}

export function AppHeader({ leftSlot }: AppHeaderProps) {
  const { isDark, toggle } = useContext(ThemeContext);
  const { plan, openUpgrade } = useContext(UserContext);
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const { open: openExtModal } = useExtensionModal();

  const muted   = isDark ? '#888888' : '#6b7280';
  const text    = isDark ? '#ffffff' : '#111111';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  return (
    <header
      className="flex items-center justify-between px-4 h-[52px] flex-shrink-0"
    >
      {/* ── Left: optional slot ── */}
      <div className="flex items-center gap-2">
        {leftSlot}
      </div>

      {/* ── Right: Chrome extension + notifications + theme toggle ── */}
      <div className="flex items-center gap-3">

        {/* Upgrade Plan — free users only */}
        {plan === 'free' && (
          <button
            onClick={openUpgrade}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0"
            style={{
              color: isDark ? text : muted,
              background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'transparent'}`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';
            }}
            title="Upgrade to Pro"
          >
            <Zap className="w-3.5 h-3.5" style={{ fill: 'currentColor' }} />
            <span className="text-xs whitespace-nowrap" style={{ fontWeight: 600 }}>Upgrade my plan</span>
          </button>
        )}

        {/* Install Chrome Extension */}
        <button
          onClick={openExtModal}
          className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{
            color: isDark ? text : muted,
            background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'transparent'}`,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.10)' : hoverBg; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'; }}
        >
          <div style={{ width: 16, height: 16, flexShrink: 0 }}>
            <Rd />
          </div>
          <span className="text-xs whitespace-nowrap">Install Chrome Extension</span>
        </button>

        {/* Notifications */}
        <div className="relative flex-shrink-0">
          <button
            ref={bellRef}
            onClick={() => setNotifOpen(prev => !prev)}
            className="p-1.5 rounded-lg transition-colors relative"
            style={{
              color: isDark ? text : muted,
              background: notifOpen
                ? (isDark ? 'rgba(255,255,255,0.10)' : hoverBg)
                : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'),
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'transparent'}`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.10)' : hoverBg; }}
            onMouseLeave={e => {
              if (!notifOpen) (e.currentTarget as HTMLButtonElement).style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';
            }}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {!notifOpen && (
              <span
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                style={{ background: '#00b8b2' }}
              />
            )}
          </button>

          {notifOpen && (
            <NotificationsDropdown
              anchorRef={bellRef}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{
            color: isDark ? text : muted,
            background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'transparent'}`,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background   = isDark ? 'rgba(255,255,255,0.10)' : hoverBg;
            (e.currentTarget as HTMLButtonElement).style.borderColor  = isDark ? 'rgba(255,255,255,0.15)' : 'transparent';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';
            (e.currentTarget as HTMLButtonElement).style.borderColor  = isDark ? 'rgba(255,255,255,0.10)' : 'transparent';
          }}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
}