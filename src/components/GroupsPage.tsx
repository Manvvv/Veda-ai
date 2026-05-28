import React, { useState } from 'react'
import { C, MOCK_GROUPS } from '@/utils/constants'
import { User, Group } from '@/utils/types'
import { TopBar } from './UI'

export default function GroupsPage({ user }: { user: User }) {
  const [showCreate, setShowCreate] = useState(false)
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS)
  const [form, setForm] = useState({ name: '', subject: '', students: '' })

  const colors = [C.orange, C.purple, C.blue, C.green, C.yellow, C.red]

  const create = () => {
    if (!form.name || !form.subject) return
    setGroups((g) => [...g, { id: Date.now(), name: form.name, students: parseInt(form.students) || 0, color: colors[g.length % colors.length], initials: form.name.slice(0, 2).toUpperCase(), subject: form.subject, lastActive: 'Just now' }])
    setForm({ name: '', subject: '', students: '' })
    setShowCreate(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="My Groups" user={user}>
        <button onClick={() => setShowCreate((s) => !s)} style={{ padding: '5px 12px', background: C.dark, color: 'white', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>+ New Group</button>
      </TopBar>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, display: 'inline-block' }} />
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: C.dark, margin: 0 }}>My Groups</h2>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Manage your student groups and classes.</p>
          </div>
        </div>

        {showCreate && (
          <div style={{ background: C.card, border: `1px solid ${C.orange}44`, borderRadius: 11, padding: '16px 18px', marginBottom: 16 }}>
            <h4 style={{ fontSize: 12, fontWeight: 600, color: C.dark, margin: '0 0 12px' }}>Create New Group</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 9, marginBottom: 10 }}>
              {[['Group Name', 'name', 'e.g. Grade 9 - Biology', 'text'], ['Subject', 'subject', 'e.g. Biology', 'text'], ['Students', 'students', '32', 'number']].map(([lbl, key, ph, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 3 }}>{lbl}</label>
                  <input value={(form as Record<string, string>)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={ph} type={type}
                    style={{ width: '100%', padding: '6px 9px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, outline: 'none' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button onClick={create} style={{ padding: '6px 14px', background: C.dark, color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>Create Group</button>
              <button onClick={() => setShowCreate(false)} style={{ padding: '6px 12px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.card, fontSize: 11, cursor: 'pointer', color: C.dark }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {groups.map((g) => (
            <div key={g.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: '14px 16px', cursor: 'pointer', transition: 'transform 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: g.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{g.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 600, color: C.dark, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</h4>
                  <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{g.subject}</p>
                </div>
                <span style={{ color: C.muted, fontSize: 16 }}>⋮</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 9, borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.muted }}>
                  <span>👥</span><span><b style={{ color: C.dark }}>{g.students}</b> students</span>
                </div>
                <span style={{ fontSize: 9, color: C.muted }}>{g.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
