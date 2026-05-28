import React, { useState } from 'react'
import { C, TOOLKIT_TOOLS } from '@/utils/constants'
import { User } from '@/utils/types'
import { TopBar, Badge, Spinner } from './UI'
import { runToolkitTool } from '@/utils/api'

export default function ToolkitPage({ user }: { user: User }) {
  const [sel, setSel] = useState<typeof TOOLKIT_TOOLS[0] | null>(null)
  const [inp, setInp] = useState('')
  const [out, setOut] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!inp.trim() || !sel) return
    setLoading(true); setOut('')
    try {
      const result = await runToolkitTool(sel.title, inp)
      setOut(result)
    } catch {
      setOut('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="AI Teacher's Toolkit" user={user} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: C.dark, margin: 0 }}>AI Teacher&#39;s Toolkit</h2>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Powerful AI tools to supercharge your teaching workflow.</p>
        </div>

        {!sel ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {TOOLKIT_TOOLS.map((t) => (
              <div key={t.id} onClick={() => { setSel(t); setInp(''); setOut('') }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: '16px 14px', cursor: 'pointer', transition: 'transform 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: t.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{t.icon}</div>
                  <Badge label={t.badge} color={t.color} />
                </div>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: C.dark, margin: '0 0 4px' }}>{t.title}</h4>
                <p style={{ fontSize: 10, color: C.muted, margin: 0, lineHeight: 1.5 }}>{t.desc}</p>
                <div style={{ marginTop: 10, fontSize: 10, color: t.color, fontWeight: 500 }}>Try now →</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ maxWidth: 600 }}>
            <button onClick={() => setSel(null)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 11, marginBottom: 14, padding: 0 }}>← Back to Tools</button>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15, paddingBottom: 13, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: sel.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{sel.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: 0 }}>{sel.title}</h3>
                  <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{sel.desc}</p>
                </div>
                <Badge label={sel.badge} color={sel.color} />
              </div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Describe your task</label>
              <textarea value={inp} onChange={(e) => setInp(e.target.value)} placeholder="e.g. Generate 5 questions on photosynthesis for Grade 8…" rows={3}
                style={{ width: '100%', padding: '9px 10px', border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 11, outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: 10 }} />
              <button onClick={run} disabled={loading || !inp.trim()}
                style={{ padding: '8px 18px', background: loading || !inp.trim() ? '#ccc' : C.dark, color: 'white', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: loading || !inp.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                {loading && <Spinner />}
                {loading ? 'Processing…' : 'Run Tool ✨'}
              </button>
              {out && (
                <div style={{ marginTop: 14, padding: '12px 14px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8 }}>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 13 }}>✨</span>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 600, color: '#1E40AF', margin: '0 0 4px' }}>AI Response</p>
                      <p style={{ fontSize: 11, color: C.dark, margin: 0, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{out}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
