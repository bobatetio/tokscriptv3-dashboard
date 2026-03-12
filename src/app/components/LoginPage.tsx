import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthHeader } from './AuthHeader';

export function LoginPage() {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Colour palette (matches dashboard dark mode) ──────────────────────────
  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const cardBg  = isDark ? '#141414' : '#ffffff';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const inputBg = isDark ? '#0d0d0d' : '#ffffff';

  const inputBase = `w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all`;
  const inputStyle = {
    background: inputBg,
    borderColor: border,
    color: text,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 1200);
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
            <h1 className="text-center mb-1" style={{ fontSize: '1.35rem', fontWeight: 700, color: text }}>
              Welcome back
            </h1>
            <p className="text-center text-sm mb-7" style={{ color: muted }}>
              Sign in to your Tokscript account
            </p>

            {/* Social button */}
            <div className="flex flex-col gap-2.5 mb-6">
              <button
                className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border text-sm transition-colors"
                style={{ background: inputBg, borderColor: border, color: text }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ background: border }} />
              <span className="text-xs" style={{ color: muted }}>or</span>
              <div className="flex-1 h-px" style={{ background: border }} />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm mb-1.5" style={{ fontWeight: 500, color: text }}>Email</label>
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
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm" style={{ fontWeight: 500, color: text }}>Password</label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-xs transition-colors"
                    style={{ color: '#00F2EA' }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: muted }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`${inputBase} pr-10`}
                    style={inputStyle}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: muted }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
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
                    Signing in…
                  </span>
                ) : 'Log in'}
              </button>
            </form>

            {/* Footer link */}
            <p className="text-center text-sm mt-6" style={{ color: muted }}>
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="transition-colors text-[14px]"
                style={{ color: '#00F2EA', fontWeight: 500 }}
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Fine print */}
          <p className="text-center text-xs mt-5 leading-relaxed" style={{ color: muted }}>
            By signing in you agree to our{' '}
            <span className="underline cursor-pointer">Terms of Service</span>{' '}
            and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
