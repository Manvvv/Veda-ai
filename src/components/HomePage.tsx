import React from 'react'
import { C, RECENT_ACTIVITY, TOOLKIT_TOOLS, MOCK_GROUPS, MOCK_LIBRARY } from '@/utils/constants'
import { User, Assignment } from '@/utils/types'
import { StatCard, TopBar } from './UI'
import { Badge } from './UI'

interface HomePageProps {
  user: User
  assignments: Assignment[]
  setPage: (p: string) => void
}

export default function HomePage({ user, assignments, setPage }: HomePageProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="Home" user={user} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg,#1A1A1A 0%,#2D1810 100%)', borderRadius: 14, padding: '20px 24px', marginBottom: 18, color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 110, height: 110, borderRadius: '50%', background: '#E55A2B14' }} />
          <div style={{ position: 'absolute', right: 16, top: 8, fontSize: 36, opacity: 0.12 }}>✨</div>
          <p style={{ fontSize: 10, color: '#E55A2B', fontWeight: 700, marginBottom: 5, letterSpacing: '1px' }}>WELCOME BACK</p>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Good Morning, {user.name}! 👋</h2>
          <p style={{ fontSize: 11, color: '#888', margin: '0 0 14px' }}>{user.school}</p>
          <button onClick={() => setPage('create')} style={{ background: C.orange, color: 'white', border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            + Create Assignment
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginBottom: 18 }}>
          <StatCard icon="📋" label="Total Assignments" value={assignments.length} color={C.orange} />
          <StatCard icon="👥" label="Student Groups" value={MOCK_GROUPS.length} color={C.purple} />
          <StatCard icon="📚" label="Library Files" value={MOCK_LIBRARY.length} color={C.blue} />
          <StatCard icon="✅" label="Papers Generated" value={assignments.length} color={C.green} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Recent Activity */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: C.dark, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>⚡</span> Recent Activity
            </h3>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', paddingBottom: 9, marginBottom: 9, borderBottom: i < RECENT_ACTIVITY.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{a.icon}</div>
                <div>
                  <p style={{ fontSize: 11, color: C.dark, margin: 0, lineHeight: 1.4 }}>{a.text}</p>
                  <p style={{ fontSize: 10, color: C.muted, margin: '2px 0 0' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tools */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: C.dark, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>🛠</span> Quick Tools
            </h3>
            {TOOLKIT_TOOLS.slice(0, 4).map((t) => (
              <div key={t.id} onClick={() => setPage('toolkit')}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px', borderRadius: 7, cursor: 'pointer', marginBottom: 3, transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width: 27, height: 27, borderRadius: 6, background: t.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{t.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: C.dark, margin: 0 }}>{t.title}</p>
                  <p style={{ fontSize: 10, color: C.muted, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.desc}</p>
                </div>
                <Badge label={t.badge} color={t.color} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
