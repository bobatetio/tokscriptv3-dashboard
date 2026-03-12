import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { Moon, Sun, Menu, X, ArrowLeft } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AppLogo } from './AppLogo';

interface AuthHeaderProps {
  showBack?: boolean;
  backLabel?: string;
  backTo?: string;
}

export function AuthHeader({ showBack = false, backLabel = 'Back', backTo = '/' }: AuthHeaderProps) {
  const navigate = useNavigate();
  const { isDark, toggle } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className="h-[68px] flex items-center justify-between z-50"
        style={{
          position: 'fixed',
          top: '34px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '910px',
          maxWidth: 'calc(100% - 32px)',
          borderRadius: '16px',
          padding: '0 32px',
          background: isDark ? 'rgba(17,17,17,0.96)' : 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: isDark ? '0 1px 6px rgba(0,0,0,0.6)' : '0 1px 6px rgba(0,0,0,0.05)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center h-full" style={{ width: '140px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <AppLogo height={28} />
          </button>
        </div>

        {/* Centre link — desktop */}
        {showBack && (
          <button
            onClick={() => navigate(backTo)}
            className="hidden lg:flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: isDark ? '#888888' : '#4b5563' }}
          >
            <ArrowLeft className="w-4 h-4" /> {backLabel}
          </button>
        )}
        {!showBack && <div className="hidden lg:block" />}

        {/* Actions — desktop */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ color: isDark ? '#888888' : '#6b7280' }}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <span className="text-sm" style={{ color: isDark ? '#888888' : '#6b7280' }}>
            Already have an account?
          </span>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-[8px] text-sm transition-colors"
            style={{ background: 'transparent', border: `1px solid ${isDark ? '#262626' : '#111111'}`, color: isDark ? '#E3E3E3' : '#111111' }}
          >
            Log in
          </button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-1">
          <button onClick={toggle} className="p-2 transition-colors" style={{ color: isDark ? '#888888' : '#6b7280' }}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-2" style={{ color: isDark ? '#E3E3E3' : '#374151' }} onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-4 top-[88px] z-40 rounded-2xl px-5 py-4 flex flex-col gap-3" style={{ background: isDark ? '#111111' : '#ffffff', border: `1px solid ${isDark ? '#262626' : '#e5e7eb'}` }}>
          {showBack && (
            <button onClick={() => navigate(backTo)} className="flex items-center gap-2 text-sm py-2" style={{ color: isDark ? '#E3E3E3' : '#374151', borderBottom: `1px solid ${isDark ? '#262626' : '#f3f4f6'}` }}>
              <ArrowLeft className="w-4 h-4" /> {backLabel}
            </button>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={() => navigate('/login')} className="flex-1 py-2 rounded-[8px] text-sm" style={{ border: `1px solid ${isDark ? '#262626' : '#111111'}`, color: isDark ? '#E3E3E3' : '#111111' }}>Log in</button>
            <button onClick={() => navigate('/signup')} className="flex-1 py-2 rounded-[8px] text-sm font-medium" style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff' }}>Sign up free</button>
          </div>
        </div>
      )}
    </>
  );
}