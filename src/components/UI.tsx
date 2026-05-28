import React from 'react'
import { C, DIFFICULTY_STYLES } from '@/utils/constants'

// ── Avatar ──
export function Avatar({ initials, color = C.orange, size = 32 }: { initials: string; color?: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: size * 0.35, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

// ── Difficulty Badge ──
export function DiffBadge({ diff }: { diff: string }) {
  const d = DIFFICULTY_STYLES[diff] || { bg: '#F3F4F6', text: C.muted, border: C.border }
  return (
    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 700, background: d.bg, color: d.text, border: `1px solid ${d.border}`, whiteSpace: 'nowrap' }}>
      {diff}
    </span>
  )
}

// ── Badge ──
export function Badge({ label, color = C.orange }: { label: string; color?: string }) {
  return (
    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, fontWeight: 700, background: color + '22', color, border: `1px solid ${color}44`, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

// ── Stat Card ──
export function StatCard({ icon, label, value, color = C.orange }: { icon: string; label: string; value: number; color?: string }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '13px 14px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{icon}</div>
        <span style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.dark }}>{value}</div>
    </div>
  )
}

// ── Spinner ──
export function Spinner({ size = 14, color = 'white' }: { size?: number; color?: string }) {
  return (
    <div style={{ width: size, height: size, border: `2px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  )
}

// ── Top Bar ──
export function TopBar({ title, onBack, children, user }: { title: string; onBack?: () => void; children?: React.ReactNode; user?: { initials: string; name: string; avatarColor?: string } }) {
  return (
    <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {onBack && <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.muted, padding: '2px 5px' }}>←</button>}
        <span style={{ fontSize: 12, color: C.muted }}>📋 {title}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: 15, cursor: 'pointer' }}>🔔</span>
          <span style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: '50%', background: C.orange, border: '1px solid white' }} />
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', padding: '3px 7px', borderRadius: 6, border: `1px solid ${C.border}` }}>
            <Avatar initials={user.initials} color={user.avatarColor || C.orange} size={24} />
            <span style={{ fontSize: 11, color: C.dark, fontWeight: 500 }}>{user.name}</span>
            <span style={{ fontSize: 9, color: C.muted }}>▾</span>
          </div>
        )}
      </div>
    </div>
  )
}
