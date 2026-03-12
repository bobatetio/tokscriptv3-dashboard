import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthHeader } from './AuthHeader';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // ── Colour palette (matches dashboard dark mode) ──────────────────────────
  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const cardBg  = isDark ? '#141414' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const inputBg = isDark ? '#0d0d0d' : '#ffffff';

  const inputBase = `w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all`;
  const inputStyle = { background: inputBg, borderColor: border, color: text };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>
      <AuthHeader />

      <main className="flex-1 flex items-center justify-center px-4" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <div className="w-full max-w-[420px]">

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{ background: cardBg, border: `1px solid ${border}` }}
          >
            {!sent ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #00F2EA 0%, #00b8b3 100%)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                </div>

                <h1 className="text-center mb-1" style={{ fontSize: '1.35rem', fontWeight: 700, color: text }}>
                  Forgot your password?
                </h1>
                <p className="text-center text-sm mb-7 leading-relaxed" style={{ color: muted }}>
                  No worries — enter your email and we'll send you a reset link.
                </p>

                {/* Error */}
                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm mb-1.5" style={{ fontWeight: 500, color: text }}>Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: muted }} />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className={inputBase}
                        style={inputStyle}
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm transition-colors disabled:opacity-60 mt-1"
                    style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 600 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#e8e8e8' : '#2a2a2a'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#ffffff' : '#111111'; }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending…
                      </span>
                    ) : 'Send reset link'}
                  </button>
                </form>

                {/* Back to login */}
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-1.5 mt-5 text-sm transition-colors"
                  style={{ color: muted }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = text; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = muted; }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </button>
              </>
            ) : (
              /* ── Success state ── */
              <div className="flex flex-col items-center text-center py-2">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ background: isDark ? 'rgba(0,242,234,0.1)' : 'rgba(0,242,234,0.12)' }}
                >
                  <CheckCircle2 className="w-7 h-7" style={{ color: '#00F2EA' }} />
                </div>
                <h2 className="mb-2" style={{ fontSize: '1.25rem', fontWeight: 700, color: text }}>
                  Check your inbox
                </h2>
                <p className="text-sm leading-relaxed mb-2" style={{ color: muted }}>
                  We've sent a password reset link to
                </p>
                <p className="text-sm mb-6" style={{ fontWeight: 600, color: text }}>
                  {email}
                </p>
                <p className="text-xs leading-relaxed mb-7" style={{ color: muted }}>
                  Didn't receive it? Check your spam folder, or{' '}
                  <button
                    onClick={() => setSent(false)}
                    className="transition-colors"
                    style={{ color: '#00F2EA' }}
                  >
                    try again
                  </button>
                  .
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 rounded-xl text-sm transition-colors"
                  style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 600 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#e8e8e8' : '#2a2a2a'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? '#ffffff' : '#111111'; }}
                >
                  Back to sign in
                </button>
              </div>
            )}
          </div>

          {/* Fine print */}
          {!sent && (
            <p className="text-center text-xs mt-5 leading-relaxed" style={{ color: muted }}>
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="transition-colors"
                style={{ color: '#00F2EA' }}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
