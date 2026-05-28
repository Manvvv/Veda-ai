import React from 'react'
import { C } from '@/utils/constants'
import { Avatar } from './UI'
import { User } from '@/utils/types'

interface SidebarProps {
  page: string
  setPage: (p: string) => void
  onLogout: () => void
  user: User
  assignmentsCount: number
}

const NAV = [
  { icon: '⊞', label: 'Home', key: 'home' },
  { icon: '👥', label: 'My Groups', key: 'groups' },
  { icon: '📋', label: 'Assignments', key: 'assignments' },
  { icon: '🤖', label: "AI Teacher's Toolkit", key: 'toolkit' },
  { icon: '📚', label: 'My Library', key: 'library' },
]

export default function Sidebar({ page, setPage, onLogout, user, assignmentsCount }: SidebarProps) {
  const activePage = page === 'create' ? 'assignments' : page

  return (
    <div style={{ width: 215, background: C.card, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 28, height: 28, background: C.orange, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 15, fontStyle: 'italic' }}>V</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>VedaAI</span>
      </div>

      {/* Create Button */}
      <div style={{ padding: '10px 10px 6px' }}>
        <button onClick={() => setPage('create')} style={{ width: '100%', background: C.dark, color: 'white', border: 'none', borderRadius: 7, padding: '9px 0', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
          + Create Assignment
        </button>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 2 }}>
        {NAV.map((item) => {
          const active = activePage === item.key
          return (
            <div key={item.key} onClick={() => setPage(item.key)}
              style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, background: active ? '#F0EDE8' : 'transparent', borderLeft: active ? `3px solid ${C.orange}` : '3px solid transparent', cursor: 'pointer', fontSize: 12, color: active ? C.dark : C.muted, fontWeight: active ? 600 : 400, transition: 'all 0.15s', userSelect: 'none' }}>
              <span style={{ fontSize: 13 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.key === 'assignments' && assignmentsCount > 0 && (
                <span style={{ background: C.orange, color: 'white', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{assignmentsCount}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Settings & Profile */}
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <div onClick={() => setPage('settings')} style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: activePage === 'settings' ? C.dark : C.muted, background: activePage === 'settings' ? '#F0EDE8' : 'transparent', borderLeft: activePage === 'settings' ? `3px solid ${C.orange}` : '3px solid transparent' }}>
          <span>⚙</span><span>Settings</span>
        </div>
        <div style={{ padding: '9px 11px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar initials={user.initials} color={user.avatarColor || C.orange} size={32} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.dark, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.school}</div>
            <div style={{ fontSize: 9, color: C.muted }}>{user.name}</div>
          </div>
          <button onClick={onLogout} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.muted, padding: 2 }}>🚪</button>
        </div>
      </div>
    </div>
  )
}
