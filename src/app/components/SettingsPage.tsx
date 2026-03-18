/**
 * SettingsPage  (/settings)
 * Full settings view for logged-in users — same layout shell as all inner pages.
 */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import {
  User, Bell, Shield, CreditCard, Trash2, LogOut,
  Check, ChevronRight, Sun, Moon, Zap,
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

const SECTIONS = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'appearance',    label: 'Appearance',     icon: Sun },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'billing',       label: 'Billing & Plan', icon: CreditCard },
  { id: 'security',      label: 'Security',       icon: Shield },
] as const;

type Section = typeof SECTIONS[number]['id'];

export function SettingsPage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useContext(ThemeContext);
  const { plan, openUpgrade, transcriptionsUsed, transcriptionsLimit } = useContext(UserContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('profile');

  // ── Tokens ────────────────────────────────────────────────────────────────
  const bg      = isDark ? '#0d0d0d' : '#ffffff';
  const panelBg = isDark ? '#111111' : '#ffffff';
  const cardBg  = isDark ? '#141414' : '#f9fafb';
  const border  = isDark ? '#262626' : '#e5e7eb';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#888888' : '#6b7280';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: isDark ? '#0a0a0a' : '#ffffff' }}>
      <AppSidebar activePage="settings" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden"
           style={isDark ? undefined : { background: '#ffffff' }}>
        <AppHeader
          leftSlot={
            <span className="text-xs" style={{ color: muted }}>Settings</span>
          }
        />

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* ── Left nav ───────────────────────────────────────────────── */}
          <div
            className="flex-shrink-0 flex flex-col gap-0.5 p-3 overflow-y-auto"
            style={{ width: 200, borderRight: `1px solid ${border}`, background: panelBg }}
          >
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-left transition-colors"
                style={{
                  background: activeSection === id
                    ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')
                    : 'transparent',
                  color: activeSection === id ? text : muted,
                  fontWeight: activeSection === id ? 500 : 400,
                }}
                onMouseEnter={e => {
                  if (activeSection !== id)
                    (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
                }}
                onMouseLeave={e => {
                  if (activeSection !== id)
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {label}
                {activeSection === id && (
                  <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: muted }} />
                )}
              </button>
            ))}

            {/* Danger zone divider */}
            <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${border}` }}>
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-left transition-colors"
                style={{ color: muted, background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                Sign Out
              </button>
            </div>
          </div>

          {/* ── Main content ───────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mr-auto flex flex-col gap-5">

              {/* ════ PROFILE ════ */}
              {activeSection === 'profile' && (
                <>
                  <SectionHeader title="Profile" description="Manage your public profile information." text={text} muted={muted} />

                  {/* Avatar */}
                  <SettingsCard cardBg={cardBg} border={border}>
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MTk0MzA3Mnww&ixlib=rb-4.1.0&q=80&w=200"
                        alt="avatar"
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col gap-1.5">
                        <p className="text-xs" style={{ color: text, fontWeight: 500 }}>Profile photo</p>
                        <p className="text-[11px]" style={{ color: muted }}>JPG, PNG or GIF. Max 2 MB.</p>
                        <button
                          className="self-start px-3 py-1.5 rounded-lg text-xs transition-colors"
                          style={{ border: `1px solid ${border}`, color: text, background: 'transparent' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                          Change photo
                        </button>
                      </div>
                    </div>
                  </SettingsCard>

                  {/* Name + Email */}
                  <SettingsCard cardBg={cardBg} border={border}>
                    <div className="flex flex-col gap-4">
                      <FieldRow label="Full name" value="James Brown" isDark={isDark} text={text} muted={muted} border={border} hoverBg={hoverBg} cardBg={cardBg} />
                      <div style={{ height: 1, background: border }} />
                      <FieldRow label="Email" value="james@alignui.com" isDark={isDark} text={text} muted={muted} border={border} hoverBg={hoverBg} cardBg={cardBg} />
                      <div style={{ height: 1, background: border }} />
                      <FieldRow label="Username" value="@jamesbrown" isDark={isDark} text={text} muted={muted} border={border} hoverBg={hoverBg} cardBg={cardBg} />
                    </div>
                  </SettingsCard>
                </>
              )}

              {/* ════ APPEARANCE ════ */}
              {activeSection === 'appearance' && (
                <>
                  <SectionHeader title="Appearance" description="Customise how Tokscript looks for you." text={text} muted={muted} />

                  <SettingsCard cardBg={cardBg} border={border}>
                    <div className="flex flex-col gap-4">
                      {/* Theme */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs" style={{ color: text, fontWeight: 500 }}>Theme</p>
                          <p className="text-[11px] mt-0.5" style={{ color: muted }}>
                            {isDark ? 'Dark mode is active' : 'Light mode is active'}
                          </p>
                        </div>
                        <button
                          onClick={toggle}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
                          style={{ border: `1px solid ${border}`, color: text, background: 'transparent' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                          Switch to {isDark ? 'light' : 'dark'}
                        </button>
                      </div>

                      <div style={{ height: 1, background: border }} />

                      {/* Theme preview swatches */}
                      <div>
                        <p className="text-xs mb-3" style={{ color: text, fontWeight: 500 }}>Preview</p>
                        <div className="flex gap-3">
                          {/* Light swatch */}
                          <button
                            onClick={() => isDark && toggle()}
                            className="flex-1 rounded-xl overflow-hidden transition-all"
                            style={{
                              border: `2px solid ${!isDark ? text : border}`,
                            }}
                          >
                            <div className="h-14 flex flex-col p-2 gap-1.5" style={{ background: '#ffffff' }}>
                              <div className="flex gap-1">
                                <div className="h-1.5 rounded-full flex-1" style={{ background: '#e5e7eb' }} />
                                <div className="h-1.5 rounded-full" style={{ width: 24, background: '#d1d5db' }} />
                              </div>
                              <div className="flex gap-1.5 flex-1">
                                <div className="w-10 rounded-md" style={{ background: '#fafafa', border: '1px solid #e5e7eb' }} />
                                <div className="flex-1 rounded-md" style={{ background: '#ffffff', border: '1px solid #e5e7eb' }} />
                              </div>
                            </div>
                            <div className="py-1.5 flex items-center justify-between px-2.5" style={{ background: '#f4f4f5', borderTop: '1px solid #e5e7eb' }}>
                              <span style={{ fontSize: 10, color: '#6b7280' }}>Light</span>
                              {!isDark && <Check className="w-3 h-3" style={{ color: '#111827' }} />}
                            </div>
                          </button>

                          {/* Dark swatch */}
                          <button
                            onClick={() => !isDark && toggle()}
                            className="flex-1 rounded-xl overflow-hidden transition-all"
                            style={{
                              border: `2px solid ${isDark ? '#ffffff' : border}`,
                            }}
                          >
                            <div className="h-14 flex flex-col p-2 gap-1.5" style={{ background: '#0d0d0d' }}>
                              <div className="flex gap-1">
                                <div className="h-1.5 rounded-full flex-1" style={{ background: '#262626' }} />
                                <div className="h-1.5 rounded-full" style={{ width: 24, background: '#1a1a1a' }} />
                              </div>
                              <div className="flex gap-1.5 flex-1">
                                <div className="w-10 rounded-md" style={{ background: '#111111', border: '1px solid #262626' }} />
                                <div className="flex-1 rounded-md" style={{ background: '#141414', border: '1px solid #262626' }} />
                              </div>
                            </div>
                            <div className="py-1.5 flex items-center justify-between px-2.5" style={{ background: '#111111', borderTop: '1px solid #262626' }}>
                              <span style={{ fontSize: 10, color: '#888888' }}>Dark</span>
                              {isDark && <Check className="w-3 h-3" style={{ color: '#ffffff' }} />}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </SettingsCard>
                </>
              )}

              {/* ════ NOTIFICATIONS ════ */}
              {activeSection === 'notifications' && (
                <>
                  <SectionHeader title="Notifications" description="Choose what updates you receive from Tokscript." text={text} muted={muted} />

                  <SettingsCard cardBg={cardBg} border={border}>
                    <div className="flex flex-col gap-0">
                      {[
                        { label: 'Transcription complete',     desc: 'Get notified when a transcript finishes processing.',  defaultOn: true  },
                        { label: 'Weekly digest',              desc: 'A weekly summary of your transcription activity.',       defaultOn: false },
                        { label: 'New features & updates',     desc: 'Hear about new Tokscript features as they ship.',       defaultOn: true  },
                        { label: 'Bulk batch complete',        desc: 'Alert when a bulk transcription batch is done.',        defaultOn: true  },
                        { label: 'Creator alerts',             desc: 'Notify when a saved creator posts new content.',        defaultOn: false },
                        { label: 'Marketing emails',           desc: 'Offers, promotions, and tips from the team.',           defaultOn: false },
                      ].map((item, i, arr) => (
                        <ToggleRow
                          key={item.label}
                          label={item.label}
                          desc={item.desc}
                          defaultOn={item.defaultOn}
                          isDark={isDark}
                          text={text}
                          muted={muted}
                          border={border}
                          showDivider={i < arr.length - 1}
                        />
                      ))}
                    </div>
                  </SettingsCard>
                </>
              )}

              {/* ════ BILLING ════ */}
              {activeSection === 'billing' && (
                <>
                  <SectionHeader title="Billing & Plan" description="Manage your subscription and payment details." text={text} muted={muted} />

                  {/* Current plan card */}
                  <SettingsCard cardBg={cardBg} border={border}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs" style={{ color: text, fontWeight: 600 }}>
                            {plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                          </p>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              color: plan === 'pro' ? '#00b8b2' : muted,
                              background: plan === 'pro' ? 'rgba(0,184,178,0.12)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                              fontWeight: 600,
                            }}
                          >
                            {plan === 'pro' ? 'Active' : 'Current'}
                          </span>
                        </div>
                        <p className="text-[11px]" style={{ color: muted }}>
                          {plan === 'pro'
                            ? 'Unlimited transcriptions · All languages · Priority queue · All exports'
                            : `${transcriptionsUsed} / ${transcriptionsLimit} transcriptions used · Basic export only`}
                        </p>
                        {/* Quota bar for free */}
                        {plan === 'free' && (
                          <div className="mt-2 flex flex-col gap-1">
                            <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }}>
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${(transcriptionsUsed / transcriptionsLimit) * 100}%`,
                                  background: transcriptionsUsed >= transcriptionsLimit ? '#ef4444' : 'linear-gradient(90deg,#00b8b2,#0077ff)',
                                }}
                              />
                            </div>
                            <span className="text-[10px]" style={{ color: muted }}>Resets monthly</span>
                          </div>
                        )}
                      </div>
                      {plan === 'free' && (
                        <button
                          onClick={openUpgrade}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                          style={{ background: 'linear-gradient(135deg,#00b8b2,#0077ff)', color: '#ffffff', fontWeight: 600 }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                        >
                          <Zap className="w-3 h-3" />
                          Upgrade to Pro
                        </button>
                      )}
                    </div>
                  </SettingsCard>

                  {/* Plans comparison */}
                  <SettingsCard cardBg={cardBg} border={border}>
                    <p className="text-xs mb-3" style={{ color: text, fontWeight: 500 }}>Available plans</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { name: 'Free',  price: '$0',  perks: '5 transcriptions / mo · Basic export',             isCurrent: plan === 'free' },
                        { name: 'Pro',   price: '$15', perks: 'Unlimited · All languages · Priority',              isCurrent: plan === 'pro'  },
                        { name: 'Team',  price: '$39', perks: '5 seats · Admin dashboard · API access',            isCurrent: false },
                      ].map(p => (
                        <div
                          key={p.name}
                          className="flex items-center justify-between px-4 py-3 rounded-xl"
                          style={{
                            border: `1px solid ${p.isCurrent ? (p.name === 'Pro' ? 'rgba(0,184,178,0.35)' : (isDark ? 'rgba(255,255,255,0.15)' : '#d1d5db')) : border}`,
                            background: p.isCurrent ? (p.name === 'Pro' ? (isDark ? 'rgba(0,184,178,0.07)' : 'rgba(0,184,178,0.04)') : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')) : 'transparent',
                          }}
                        >
                          <div>
                            <p className="text-xs" style={{ color: text, fontWeight: 500 }}>{p.name}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: muted }}>{p.perks}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs" style={{ color: p.isCurrent ? muted : text, fontWeight: 500 }}>
                              {p.price}<span style={{ color: muted, fontWeight: 400 }}>/mo</span>
                            </span>
                            {p.isCurrent
                              ? <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: p.name === 'Pro' ? '#00b8b2' : muted, background: p.name === 'Pro' ? 'rgba(0,184,178,0.12)' : 'transparent' }}>Active</span>
                              : (
                                <button
                                  onClick={p.name !== 'Free' ? openUpgrade : undefined}
                                  className="px-2.5 py-1 rounded-lg text-[11px] transition-colors"
                                  style={{
                                    border: `1px solid ${p.name === 'Pro' ? 'rgba(0,184,178,0.35)' : border}`,
                                    color: p.name === 'Pro' ? '#00b8b2' : text,
                                    background: 'transparent',
                                    fontWeight: p.name === 'Pro' ? 600 : 400,
                                  }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                >
                                  {p.name === 'Free' ? 'Downgrade' : 'Select'}
                                </button>
                              )
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </SettingsCard>
                </>
              )}

              {/* ════ SECURITY ════ */}
              {activeSection === 'security' && (
                <>
                  <SectionHeader title="Security" description="Manage your password and account security." text={text} muted={muted} />

                  <SettingsCard cardBg={cardBg} border={border}>
                    <div className="flex flex-col gap-4">
                      <FieldRow label="Current password" value="••••••••••" isDark={isDark} text={text} muted={muted} border={border} hoverBg={hoverBg} cardBg={cardBg} isPassword />
                      <div style={{ height: 1, background: border }} />
                      <FieldRow label="New password" value="" placeholder="Enter new password" isDark={isDark} text={text} muted={muted} border={border} hoverBg={hoverBg} cardBg={cardBg} isPassword />
                      <div style={{ height: 1, background: border }} />
                      <FieldRow label="Confirm password" value="" placeholder="Confirm new password" isDark={isDark} text={text} muted={muted} border={border} hoverBg={hoverBg} cardBg={cardBg} isPassword />
                    </div>
                    <div className="flex justify-end mt-4 pt-4" style={{ borderTop: `1px solid ${border}` }}>
                      <button
                        className="px-4 py-2 rounded-lg text-xs transition-colors"
                        style={{ background: isDark ? '#ffffff' : '#111111', color: isDark ? '#111111' : '#ffffff', fontWeight: 500 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                      >
                        Update password
                      </button>
                    </div>
                  </SettingsCard>

                  {/* Danger zone */}
                  <SettingsCard cardBg={cardBg} border={border}>
                    <p className="text-xs mb-3" style={{ color: text, fontWeight: 500 }}>Danger zone</p>
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ border: `1px solid ${border}` }}>
                      <div>
                        <p className="text-xs" style={{ color: text }}>Delete account</p>
                        <p className="text-[11px] mt-0.5" style={{ color: muted }}>Permanently delete your account and all data. This cannot be undone.</p>
                      </div>
                      <button
                        className="flex items-center gap-1.5 flex-shrink-0 ml-4 px-3 py-1.5 rounded-lg text-xs transition-colors"
                        style={{ color: muted, border: `1px solid ${border}`, background: 'transparent' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </SettingsCard>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title, description, text, muted }: { title: string; description: string; text: string; muted: string }) {
  return (
    <div className="mb-1">
      <p style={{ color: text, fontWeight: 600 }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: muted }}>{description}</p>
    </div>
  );
}

function SettingsCard({ children, cardBg, border }: { children: React.ReactNode; cardBg: string; border: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
      {children}
    </div>
  );
}

function FieldRow({
  label, value, placeholder, isDark, text, muted, border, hoverBg, cardBg, isPassword,
}: {
  label: string; value: string; placeholder?: string; isDark: boolean;
  text: string; muted: string; border: string; hoverBg: string; cardBg: string; isPassword?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] mb-1" style={{ color: muted }}>{label}</p>
        {editing ? (
          <input
            autoFocus
            type={isPassword ? 'password' : 'text'}
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder={placeholder}
            className="w-full px-2.5 py-1.5 rounded-lg text-xs outline-none"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${border}`,
              color: text,
            }}
          />
        ) : (
          <p className="text-xs truncate" style={{ color: val ? text : muted }}>
            {val || placeholder || '—'}
          </p>
        )}
      </div>
      <button
        onClick={() => setEditing(e => !e)}
        className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
        style={{ border: `1px solid ${border}`, color: muted, background: 'transparent' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; (e.currentTarget as HTMLButtonElement).style.color = text; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = muted; }}
      >
        {editing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}

function ToggleRow({
  label, desc, defaultOn, isDark, text, muted, border, showDivider,
}: {
  label: string; desc: string; defaultOn: boolean; isDark: boolean;
  text: string; muted: string; border: string; showDivider: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <>
      <div className="flex items-center justify-between gap-4 py-3.5">
        <div>
          <p className="text-xs" style={{ color: text, fontWeight: 500 }}>{label}</p>
          <p className="text-[11px] mt-0.5" style={{ color: muted }}>{desc}</p>
        </div>
        {/* Toggle pill */}
        <button
          onClick={() => setOn(o => !o)}
          className="flex-shrink-0 relative rounded-full transition-all"
          style={{
            width: 36, height: 20,
            background: on ? (isDark ? '#ffffff' : '#111111') : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'),
          }}
        >
          <span
            className="absolute top-0.5 rounded-full transition-all"
            style={{
              width: 16, height: 16,
              background: on ? (isDark ? '#111111' : '#ffffff') : (isDark ? '#888888' : '#d1d5db'),
              left: on ? 18 : 2,
            }}
          />
        </button>
      </div>
      {showDivider && <div style={{ height: 1, background: border }} />}
    </>
  );
}