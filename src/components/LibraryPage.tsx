import React, { useState, useRef } from 'react'
import { C, MOCK_LIBRARY } from '@/utils/constants'
import { User, LibraryFile } from '@/utils/types'
import { TopBar, Spinner } from './UI'

export default function LibraryPage({ user }: { user: User }) {
  const [lib, setLib] = useState<LibraryFile[]>(MOCK_LIBRARY)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = lib.filter((f) => f.title.toLowerCase().includes(search.toLowerCase()))

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    await new Promise((r) => setTimeout(r, 900))
    const types: Record<string, string> = { pdf: 'PDF', txt: 'Text', jpg: 'Image', jpeg: 'Image', png: 'Image' }
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    setLib((prev) => [{ id: Date.now(), title: file.name.replace(/\.[^/.]+$/, ''), type: types[ext] || 'File', date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'), size: `${(file.size / 1024).toFixed(0)} KB`, icon: ext === 'pdf' ? '📄' : ext.match(/jpe?g|png/) ? '🖼' : '📝' }, ...prev])
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="My Library" user={user}>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ padding: '5px 12px', background: uploading ? '#aaa' : C.dark, color: 'white', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          {uploading && <Spinner size={10} />}
          {uploading ? 'Uploading…' : '⬆ Upload File'}
        </button>
        <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={upload} />
      </TopBar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 9 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: C.dark, margin: 0 }}>My Library</h2>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>All your uploaded documents and reference materials.</p>
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search files…"
            style={{ padding: '6px 11px', border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 11, outline: 'none', background: C.card, width: 180 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          {filtered.map((f) => (
            <div key={f.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: f.type === 'PDF' ? '#FEE2E2' : f.type === 'Image' ? '#EDE9FE' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{f.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: 11, fontWeight: 500, color: C.dark, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.title}</h4>
                <div style={{ display: 'flex', gap: 6, marginTop: 3, fontSize: 9, color: C.muted, flexWrap: 'wrap' }}>
                  <span style={{ background: C.bg, padding: '1px 5px', borderRadius: 3, fontWeight: 500 }}>{f.type}</span>
                  <span>{f.date}</span>
                  <span>{f.size}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.muted, padding: 3 }}>👁</button>
                <button onClick={() => setLib((prev) => prev.filter((x) => x.id !== f.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#DC2626', padding: 3 }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 0', color: C.muted }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
            <p style={{ fontSize: 12 }}>No files found. Upload your first document!</p>
          </div>
        )}
      </div>
    </div>
  )
}
