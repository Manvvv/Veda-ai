import React, { useState } from 'react'
import { C } from '@/utils/constants'
import { User } from '@/utils/types'
import { TopBar, Avatar } from './UI'

interface SettingsPageProps {
  user: User
  setUser: (fn: (u: User) => User) => void
  onLogout: () => void
}

const TABS = [
  { key: 'profile', label: 'Profile', icon: '👤' },
  { key: 'notifications', label: 'Notifications', icon: '🔔' },
  { key: 'security', label: 'Security', icon: '🔒' },
  { key: 'appearance', label: 'Appearance', icon: '🎨' },
]

export default function SettingsPage({ user, setUser, onLogout }: SettingsPageProps) {
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState({ name: user.name, email: user.email, school: user.school, phone: '', bio: '' })
  const [notif, setNotif] = useState({ emailAlerts: true, submissionNotifs: true, weeklyReport: false, dueDateReminders: true })
  const [saved, setSaved] = useState(false)
  const [accentColor, setAccentColor] = useState(C.orange)

  const save = () => {
    setUser((u) => ({ ...u, name: profile.name, school: profile.school, email: profile.email, initials: profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="Settings" user={user} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: C.dark, margin: 0 }}>Settings</h2>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Manage your account preferences and settings.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 14, maxWidth: 680 }}>
          {/* Tab List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 11px', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: tab === t.key ? 600 : 400, background: tab === t.key ? '#F0EDE8' : 'transparent', color: tab === t.key ? C.dark : C.muted, textAlign: 'left', transition: 'all 0.15s' }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 11px', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 11, color: '#DC2626', background: 'transparent', width: '100%', textAlign: 'left' }}>🚪 Sign Out</button>
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: '18px 20px' }}>

            {/* Profile */}
            {tab === 'profile' && <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                <Avatar initials={user.initials} color={user.avatarColor || C.orange} size={48} />
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: 0 }}>{user.name}</h4>
                  <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{user.email}</p>
                  <button style={{ fontSize: 10, color: C.orange, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 3 }}>Change Photo</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                {[['Full Name', 'name'], ['School', 'school'], ['Email', 'email'], ['Phone', 'phone']].map(([lbl, key]) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 3 }}>{lbl}</label>
                    <input value={(profile as Record<string, string>)[key]} onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '6px 9px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, outline: 'none' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 3 }}>Bio</label>
                <textarea value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} placeholder="Tell students about yourself…" rows={2}
                  style={{ width: '100%', padding: '6px 9px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              {saved && <div style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 10px', borderRadius: 6, fontSize: 11, marginBottom: 9 }}>✓ Changes saved successfully!</div>}
              <button onClick={save} style={{ padding: '7px 16px', background: C.dark, color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>Save Changes</button>
            </>}

            {/* Notifications */}
            {tab === 'notifications' && <>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: C.dark, margin: '0 0 14px' }}>Notification Preferences</h4>
              {([['emailAlerts', 'Email Alerts', 'Receive important updates via email'], ['submissionNotifs', 'Submission Notifications', 'Alert when students submit assignments'], ['weeklyReport', 'Weekly Report', 'Get a weekly performance summary'], ['dueDateReminders', 'Due Date Reminders', 'Remind 24 hours before due dates']] as [keyof typeof notif, string, string][]).map(([key, lbl, desc]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: C.dark, margin: 0 }}>{lbl}</p>
                    <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{desc}</p>
                  </div>
                  <div onClick={() => setNotif((n) => ({ ...n, [key]: !n[key] }))}
                    style={{ width: 36, height: 19, borderRadius: 10, background: notif[key] ? C.orange : C.border, cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 2, left: notif[key] ? 18 : 2, width: 15, height: 15, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px #0003' }} />
                  </div>
                </div>
              ))}
            </>}

            {/* Security */}
            {tab === 'security' && <>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: C.dark, margin: '0 0 14px' }}>Security Settings</h4>
              {['Current Password', 'New Password', 'Confirm New Password'].map((lbl) => (
                <div key={lbl} style={{ marginBottom: 10 }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 3 }}>{lbl}</label>
                  <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '6px 9px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, outline: 'none' }} />
                </div>
              ))}
              <button style={{ padding: '7px 16px', background: C.dark, color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', marginBottom: 18 }}>Update Password</button>
              <div style={{ padding: '12px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#991B1B', margin: '0 0 3px' }}>Danger Zone</p>
                <p style={{ fontSize: 10, color: '#B91C1C', margin: '0 0 9px' }}>Permanently delete your account and all associated data.</p>
                <button style={{ padding: '5px 13px', background: '#DC2626', color: 'white', border: 'none', borderRadius: 5, fontSize: 10, cursor: 'pointer' }}>Delete Account</button>
              </div>
            </>}

            {/* Appearance */}
            {tab === 'appearance' && <>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: C.dark, margin: '0 0 5px' }}>Appearance Settings</h4>
              <p style={{ fontSize: 11, color: C.muted, margin: '0 0 14px' }}>Choose your preferred theme and display options.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 16 }}>
                {['Light', 'Dark'].map((theme) => (
                  <div key={theme} style={{ padding: '13px', border: `2px solid ${theme === 'Light' ? C.orange : C.border}`, borderRadius: 9, cursor: 'pointer', textAlign: 'center', background: theme === 'Light' ? 'white' : '#1A1A1A' }}>
                    <div style={{ fontSize: 18, marginBottom: 5 }}>{theme === 'Light' ? '☀️' : '🌙'}</div>
                    <p style={{ fontSize: 11, fontWeight: 500, color: theme === 'Light' ? C.dark : 'white', margin: 0 }}>{theme} Mode</p>
                    {theme === 'Light' && <span style={{ fontSize: 9, color: C.orange }}>✓ Active</span>}
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 7 }}>Accent Color</label>
                <div style={{ display: 'flex', gap: 7 }}>
                  {[C.orange, C.purple, C.blue, C.green, '#D97706'].map((color) => (
                    <div key={color} onClick={() => setAccentColor(color)}
                      style={{ width: 26, height: 26, borderRadius: '50%', background: color, cursor: 'pointer', border: color === accentColor ? '3px solid #1A1A1A' : '3px solid transparent', transition: 'border 0.15s' }} />
                  ))}
                </div>
              </div>
            </>}

          </div>
        </div>
      </div>
    </div>
  )
}
