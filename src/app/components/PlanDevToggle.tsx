/**
 * PlanDevToggle
 * ──────────────
 * Floating demo pill (bottom-right) to switch between Free and Pro views.
 * Remove before production.
 */
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';

export function PlanDevToggle() {
  const { plan, setPlan } = useContext(UserContext);
  const { isDark } = useContext(ThemeContext);

  return (
    <div
      className="fixed bottom-5 right-5 z-[9998] flex items-center gap-2 px-3 py-2 rounded-full shadow-lg"
      style={{
        background: isDark ? '#1a1a1a' : '#ffffff',
        border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
      }}
    >
      <span className="text-[10px] uppercase tracking-widest" style={{ color: isDark ? '#555' : '#aaa', fontWeight: 600 }}>
        Demo
      </span>
      <div
        className="flex items-center p-0.5 rounded-full gap-0.5"
        style={{ background: isDark ? '#111' : '#f3f4f6', border: `1px solid ${isDark ? '#2a2a2a' : '#e5e7eb'}` }}
      >
        {(['free', 'pro'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPlan(p)}
            className="px-3 py-1 rounded-full text-[11px] transition-all capitalize"
            style={{
              background: plan === p
                ? p === 'pro'
                  ? 'linear-gradient(135deg, #00b8b2 0%, #0077ff 100%)'
                  : (isDark ? '#262626' : '#ffffff')
                : 'transparent',
              color: plan === p
                ? p === 'pro' ? '#ffffff' : (isDark ? '#ffffff' : '#111')
                : isDark ? '#555' : '#aaa',
              fontWeight: plan === p ? 600 : 400,
              border: plan === p && p !== 'pro' ? `1px solid ${isDark ? '#333' : '#e5e7eb'}` : '1px solid transparent',
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
