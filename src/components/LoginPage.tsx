import React, { useState } from 'react'
import { C } from '@/utils/constants'
import { User } from '@/utils/types'
import { Spinner } from './UI'

interface LoginPageProps {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [form, setForm] = useState({ name: '', school: 'Delhi Public School', email: 'teacher@school.com', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setError('')
    if (!form.email || !form.password) { setError('Please fill all required fields.'); return }
    if (mode === 'signup' && form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    const name = form.name || 'John Doe'
    onLogin({
      name,
      email: form.email,
      school: form.school || 'Delhi Public School',
      initials: name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'JD',
      avatarColor: '#7C4B1A',
    })
  }

  const inp = (key: string, type = 'text', placeholder = '') => (
    <input type={type} value={(form as Record<string, string>)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      placeholder={placeholder} style={{ width: '100%', padding: '8px 11px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, outline: 'none' }} />
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1A1A1A 0%,#3D1A0A 50%,#1A1A1A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 54, height: 54, background: C.orange, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 8px 24px #E55A2B55' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 26, fontStyle: 'italic' }}>V</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>VedaAI</h1>
          <p style={{ color: '#777', fontSize: 12, marginTop: 4 }}>AI-powered assessment platform for educators</p>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: '24px 26px', boxShadow: '0 20px 60px #0009' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: 18, background: C.bg, borderRadius: 8, padding: 3 }}>
            {(['login', 'signup'] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                style={{ flex: 1, padding: '7px 0', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: mode === m ? C.card : 'transparent', color: mode === m ? C.dark : C.muted, boxShadow: mode === m ? '0 1px 4px #0001' : 'none', transition: 'all 0.2s' }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {mode === 'signup' && <div><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Full Name</label>{inp('name', 'text', 'e.g. Priya Sharma')}</div>}
            {mode === 'signup' && <div><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: C.dark, marginBottom: 4 }}>School Name</label>{inp('school', 'text', 'Delhi Public School')}</div>}
            <div><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Email Address *</label>{inp('email', 'email', 'teacher@school.com')}</div>
            <div><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Password *</label>{inp('password', 'password', 'Min. 6 characters')}</div>
            {mode === 'signup' && <div><label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Confirm Password *</label>{inp('confirm', 'password', 'Re-enter password')}</div>}
            {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '7px 11px', borderRadius: 7, fontSize: 11 }}>{error}</div>}
            <button onClick={handle} disabled={loading}
              style={{ width: '100%', padding: '10px 0', background: loading ? '#aaa' : C.dark, color: 'white', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 2, transition: 'background 0.2s' }}>
              {loading && <Spinner />}
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: C.muted }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span style={{ color: C.orange, cursor: 'pointer', fontWeight: 500 }} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </span>
          </p>
        </div>
        <p style={{ textAlign: 'center', color: '#444', fontSize: 10, marginTop: 12 }}>By continuing, you agree to VedaAI&#39;s Terms of Service</p>
      </div>
    </div>
  )
}
