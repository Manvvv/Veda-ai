import React, { useState, useRef, useEffect } from 'react'

import { C, QUESTION_TYPES, LOADING_STEPS } from '@/utils/constants'
import { User, Assignment, GeneratedPaper, AssignmentForm } from '@/utils/types'
import { TopBar, DiffBadge } from './UI'
import { generateQuestionPaper } from '@/utils/api'
import { useAppStore } from '@/store/useAppStore'

interface AssignmentsPageProps {
  user: User
  assignments: Assignment[]
  setAssignments: (fn: (prev: Assignment[]) => Assignment[]) => void
  generatedPaper: GeneratedPaper | null
  setGeneratedPaper: (p: GeneratedPaper | null) => void
}

const defaultForm: AssignmentForm = {
  subject: '', classGrade: '', school: 'Delhi Public School',
  dueDate: '', questionTypes: [{ type: 'Multiple Choice Questions', count: 5, marks: 2 }],
  additionalInstructions: '', timeAllowed: 60,
}

const STEPS = [
  'Receiving your request...',
  'Parsing uploaded reference file...',
  'Structuring AI prompt...',
  'Generating questions with Gemini AI...',
  'Parsing and validating response...',
  'Finalizing paper structure...',
]

export default function AssignmentsPage({ user, assignments, setAssignments, generatedPaper, setGeneratedPaper }: AssignmentsPageProps) {
  const [sv, setSv] = useState<'list' | 'create' | 'gen' | 'out'>('list')
  const [form, setForm] = useState<AssignmentForm>(defaultForm)
  const [ls, setLs] = useState(0)
  const [wsStep, setWsStep] = useState(0)
  const [wsMsg, setWsMsg] = useState(STEPS[0])
  const [err, setErr] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  

  const { setWsConnected } = useAppStore()

  // Init WebSocket

  const totalQ = form.questionTypes.reduce((s, qt) => s + Number(qt.count), 0)
  const totalM = form.questionTypes.reduce((s, qt) => s + Number(qt.count) * Number(qt.marks), 0)

  const addQT = () => setForm((f) => ({ ...f, questionTypes: [...f.questionTypes, { type: 'Short Answer Questions', count: 3, marks: 4 }] }))
  const removeQT = (i: number) => setForm((f) => ({ ...f, questionTypes: f.questionTypes.filter((_, idx) => idx !== i) }))
  const updateQT = (i: number, field: string, val: number | string) => {
    setForm((f) => ({ ...f, questionTypes: f.questionTypes.map((qt, idx) => idx === i ? { ...qt, [field]: val } : qt) }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.classGrade.trim()) e.classGrade = 'Class / Grade is required'
    for (const qt of form.questionTypes) {
      if (Number(qt.count) < 1) e.qtCount = 'Questions must be at least 1'
      if (Number(qt.marks) < 1) e.qtMarks = 'Marks must be at least 1'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const gen = async () => {
    if (!validate()) return
    setErr(null); setSv('gen'); setLs(0); setWsStep(0); setWsMsg(STEPS[0])
    // Fallback ticker in case WS isn't firing
    let s = 0
    const iv = setInterval(() => { s = Math.min(s + 1, STEPS.length - 1); setLs(s) }, 1800)
    try {
      const paper = await generateQuestionPaper(form, file)
      clearInterval(iv)
      const asg: Assignment = {
        id: Date.now(),
        title: `${form.subject} — ${form.classGrade}`,
        assignedOn: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        due: form.dueDate ? new Date(form.dueDate).toLocaleDateString('en-GB').replace(/\//g, '-') : '—',
      }
      setAssignments((prev) => [asg, ...prev])
      setGeneratedPaper(paper)
      setSv('out')
    } catch (e: any) {
      clearInterval(iv)
      setErr(e.message || 'Generation failed. Please try again.')
      setSv('create')
    }
  }

  const downloadPDF = async () => {
    if (!paperRef.current) return
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const canvas = await html2canvas(paperRef.current, { scale: 2, useCORS: true, backgroundColor: '#fff' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      let y = 0
      const pageH = pdf.internal.pageSize.getHeight()
      while (y < pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, -y, pdfWidth, pdfHeight)
        y += pageH
        if (y < pdfHeight) pdf.addPage()
      }
      pdf.save(`${generatedPaper?.subject || 'question'}_paper.pdf`)
    } catch (e) {
      console.error('PDF download error:', e)
    }
  }

  // ── LIST VIEW ──
  if (sv === 'list') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="Assignments" user={user}>
        <button onClick={() => { setSv('create'); setForm(defaultForm); setFileName(''); setFile(null); setErr(null); setErrors({}) }}
          style={{ padding: '5px 12px', background: C.dark, color: 'white', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
          + Create Assignment
        </button>
      </TopBar>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {assignments.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, background: '#F0EDE8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 30 }}>📄</div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: C.dark, margin: '0 0 7px' }}>No assignments yet</h3>
            <p style={{ color: C.muted, fontSize: 12, maxWidth: 300, lineHeight: 1.65, margin: '0 0 18px' }}>Create your first AI-powered assignment to get started.</p>
            <button onClick={() => setSv('create')} style={{ background: C.dark, color: 'white', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>+ Create Your First Assignment</button>
          </div>
        ) : (
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
              {assignments.map((a) => (
                <div key={a.id} onClick={() => setSv('out')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: '12px 14px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
                    <h4 style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.dark }}>{a.title}</h4>
                    <span style={{ color: C.muted, fontSize: 16 }}>⋮</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 10, color: C.muted, flexWrap: 'wrap' }}>
                    <span><b style={{ color: C.dark }}>Assigned</b>: {a.assignedOn}</span>
                    <span><b style={{ color: C.dark }}>Due</b>: {a.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // ── CREATE VIEW ──
  if (sv === 'create') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="Create Assignment" onBack={() => setSv('list')} user={user} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        <div style={{ background: C.card, borderRadius: 11, border: `1px solid ${C.border}`, padding: '18px 22px', maxWidth: 640 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: '0 0 1px' }}>Assignment Details</h3>
          <p style={{ fontSize: 11, color: C.muted, margin: '0 0 14px' }}>Fill in the details below. Upload a reference PDF to generate questions from your material.</p>

          {/* File Upload */}
          <div onClick={() => fileRef.current?.click()}
            style={{ border: `2px dashed ${file ? C.green : C.border}`, borderRadius: 8, padding: '14px', textAlign: 'center', marginBottom: 13, cursor: 'pointer', background: file ? '#F0FDF4' : '#FAFAF8', transition: 'all 0.2s' }}>
            <div style={{ fontSize: 17, marginBottom: 3 }}>{file ? '✅' : '⬆'}</div>
            <p style={{ color: file ? C.green : C.muted, fontSize: 11, margin: '0 0 2px', fontWeight: file ? 600 : 400 }}>
              {fileName || 'Upload Reference PDF / Text (Optional)'}
            </p>
            <p style={{ color: C.muted, fontSize: 9, margin: '0 0 8px' }}>JPEG, PNG, PDF, TXT — up to 10MB. AI will use this to create questions.</p>
            <button style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 5, padding: '3px 10px', fontSize: 10, cursor: 'pointer', color: C.dark }}>Browse Files</button>
            <input ref={fileRef} type="file" accept="image/*,.pdf,.txt" style={{ display: 'none' }} onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) { setFileName(f.name); setFile(f) }
            }} />
          </div>
          {file && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -10, marginBottom: 10 }}>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); setFileName(''); if (fileRef.current) fileRef.current.value = '' }}
                style={{ background: 'none', border: 'none', color: C.muted, fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}>
                Remove file
              </button>
            </div>
          )}

          {/* Subject & Class */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {([['Subject *', 'subject', 'e.g. Mathematics'], ['Class / Grade *', 'classGrade', 'e.g. Class 8']] as const).map(([lbl, key, ph]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 3 }}>{lbl}</label>
                <input value={(form as any)[key]} onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: '' })) }}
                  placeholder={ph}
                  style={{ width: '100%', padding: '6px 9px', border: `1px solid ${errors[key] ? '#EF4444' : C.border}`, borderRadius: 6, fontSize: 11, outline: 'none', background: 'white', boxSizing: 'border-box' }} />
                {errors[key] && <p style={{ color: '#EF4444', fontSize: 9, margin: '2px 0 0' }}>{errors[key]}</p>}
              </div>
            ))}
          </div>

          {/* Due Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 3 }}>Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                style={{ width: '100%', padding: '6px 9px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, outline: 'none', background: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 3 }}>Time Allowed (min)</label>
              <input type="number" value={form.timeAllowed} min={10} max={300}
                onChange={(e) => setForm((f) => ({ ...f, timeAllowed: Math.max(10, parseInt(e.target.value) || 60) }))}
                style={{ width: '100%', padding: '6px 9px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, outline: 'none', background: 'white' }} />
            </div>
          </div>

          {/* Question Types */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 64px 22px', gap: 6, marginBottom: 6, fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              <span>Question Type</span><span style={{ textAlign: 'center' }}>Questions</span><span style={{ textAlign: 'center' }}>Marks</span><span />
            </div>
            {form.questionTypes.map((qt, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 64px 22px', gap: 6, marginBottom: 7, alignItems: 'center' }}>
                <select value={qt.type} onChange={(e) => updateQT(i, 'type', e.target.value)}
                  style={{ padding: '5px 6px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 10, outline: 'none', background: 'white', color: C.dark }}>
                  {QUESTION_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                {(['count', 'marks'] as const).map((field) => (
                  <div key={field} style={{ display: 'flex', alignItems: 'center', border: `1px solid ${errors.qtCount && field === 'count' ? '#EF4444' : C.border}`, borderRadius: 6, overflow: 'hidden', background: 'white' }}>
                    <button onClick={() => updateQT(i, field, Math.max(1, Number(qt[field]) - 1))}
                      style={{ padding: '4px 7px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: C.muted }}>−</button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 500, color: C.dark }}>{qt[field]}</span>
                    <button onClick={() => updateQT(i, field, Number(qt[field]) + 1)}
                      style={{ padding: '4px 7px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: C.muted }}>+</button>
                  </div>
                ))}
                <button onClick={() => removeQT(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 12, padding: 0 }}>✕</button>
              </div>
            ))}
            <button onClick={addQT} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: `1px dashed ${C.border}`, borderRadius: 6, padding: '5px 10px', fontSize: 10, cursor: 'pointer', color: C.muted, marginTop: 2 }}>
              + Add Question Type
            </button>
            <div style={{ display: 'flex', gap: 14, marginTop: 7, fontSize: 11, color: C.muted }}>
              <span>Total Questions: <b style={{ color: C.dark }}>{totalQ}</b></span>
              <span>Total Marks: <b style={{ color: C.dark }}>{totalM}</b></span>
            </div>
          </div>

          {/* Additional Instructions */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 500, color: C.dark, marginBottom: 3 }}>Additional Instructions (optional)</label>
            <textarea value={form.additionalInstructions} onChange={(e) => setForm((f) => ({ ...f, additionalInstructions: e.target.value }))}
              placeholder="e.g. Focus on NCERT chapters 5-8, include diagram-based questions…" rows={2}
              style={{ width: '100%', padding: '7px 9px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, outline: 'none', resize: 'vertical', fontFamily: 'inherit', background: 'white', boxSizing: 'border-box' }} />
          </div>

          {err && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '8px 12px', borderRadius: 6, fontSize: 11, marginBottom: 12, lineHeight: 1.5 }}>{err}</div>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setSv('list')} style={{ padding: '7px 14px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.card, fontSize: 11, cursor: 'pointer', color: C.dark }}>← Previous</button>
            <button onClick={gen}
              style={{ padding: '8px 20px', background: C.dark, color: 'white', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              ✨ Generate Paper
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── GENERATING VIEW ──
  if (sv === 'gen') return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 22px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `4px solid ${C.border}` }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid transparent', borderTopColor: C.orange, animation: 'spin 0.9s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '12px', borderRadius: '50%', background: '#FFF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✨</div>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, margin: '0 0 6px' }}>Generating Your Question Paper</h3>
        <p style={{ color: C.muted, fontSize: 11, margin: '0 0 22px', lineHeight: 1.5 }}>
          {file ? `Analyzing "${fileName}" and crafting questions...` : 'Our AI is crafting a perfectly structured assessment...'}
        </p>

        {/* Progress Bar */}
        <div style={{ background: C.border, borderRadius: 99, height: 6, marginBottom: 18, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: C.orange, borderRadius: 99, width: `${Math.round((ls / (STEPS.length - 1)) * 100)}%`, transition: 'width 0.6s ease' }} />
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 15px', textAlign: 'left' }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 0', borderBottom: i < STEPS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9,
                background: i < ls ? C.green : i === ls ? C.orange : C.border, color: 'white', transition: 'background 0.3s' }}>
                {i < ls ? '✓' : i === ls ? '…' : ''}
              </div>
              <span style={{ fontSize: 11, color: i <= ls ? C.dark : C.muted, fontWeight: i === ls ? 600 : 400, transition: 'color 0.3s' }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── OUTPUT VIEW ──
  if (sv === 'out' && generatedPaper) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar title="Question Paper" onBack={() => setSv('list')} user={user}>
        <button onClick={() => { setSv('create'); setErr(null) }}
          style={{ padding: '4px 10px', border: `1px solid ${C.border}`, borderRadius: 6, background: C.card, fontSize: 10, cursor: 'pointer', color: C.dark }}>
          🔄 Regenerate
        </button>
        <button onClick={downloadPDF}
          style={{ padding: '4px 12px', background: C.orange, color: 'white', border: 'none', borderRadius: 6, fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>
          ⬇ Download PDF
        </button>
      </TopBar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '8px 12px', marginBottom: 14, fontSize: 11, color: '#1E40AF', display: 'flex', gap: 5 }}>
          <span>✨</span>
          <span>
            AI-generated question paper for <b>{generatedPaper.subject}</b> — {generatedPaper.class}.
            {file ? ` Based on "${fileName}".` : ''} Review before distributing.
          </span>
        </div>

        {/* Printable Paper */}
        <div ref={paperRef} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '28px 36px', maxWidth: 680, margin: '0 auto', fontFamily: "'Times New Roman', serif" }}>
          {/* Header */}
          <div style={{ textAlign: 'center', paddingBottom: 14, marginBottom: 14, borderBottom: `2px solid ${C.dark}` }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 3px', color: C.dark, textTransform: 'uppercase', letterSpacing: '1px' }}>{generatedPaper.school}</h2>
            <p style={{ fontSize: 12, color: '#444', margin: '0 0 2px' }}>Subject: <b>{generatedPaper.subject}</b> &nbsp;|&nbsp; Class: <b>{generatedPaper.class}</b></p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: C.dark }}>
            <span>Time Allowed: <b>{generatedPaper.timeAllowed}</b></span>
            <span>Maximum Marks: <b>{generatedPaper.maxMarks}</b></span>
          </div>
          <p style={{ fontSize: 10, color: C.muted, fontStyle: 'italic', margin: '0 0 14px', paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
            General Instructions: All questions are compulsory unless stated otherwise. Read each question carefully before answering.
          </p>

          {/* Student Info */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap' }}>
            {['Name', 'Roll Number', 'Section'].map((f) => (
              <div key={f} style={{ fontSize: 11, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ color: C.dark, fontWeight: 600 }}>{f}:</span>
                <span style={{ borderBottom: `1px solid ${C.dark}`, display: 'inline-block', width: 90 }}>&nbsp;</span>
              </div>
            ))}
          </div>

          {/* Sections */}
          {generatedPaper.sections?.map((sec, si) => (
            <div key={si} style={{ marginBottom: 22 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.dark, margin: '0 0 2px', borderBottom: `1px solid ${C.border}`, paddingBottom: 4 }}>{sec.title}</h3>
              <p style={{ fontSize: 10, color: C.muted, fontStyle: 'italic', margin: '0 0 10px' }}>{sec.instruction}</p>
              {sec.questions?.map((q, qi) => (
                <div key={qi} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.dark, flexShrink: 0, minWidth: 20 }}>{q.number}.</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: q.options?.length ? 5 : 0 }}>
                        <p style={{ fontSize: 12, color: C.dark, margin: 0, lineHeight: 1.65, fontFamily: 'inherit' }}>{q.text}</p>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'center' }}>
                          <DiffBadge diff={q.difficulty} />
                          <span style={{ fontSize: 10, color: C.muted, background: C.bg, padding: '2px 5px', borderRadius: 4, whiteSpace: 'nowrap', fontFamily: 'sans-serif' }}>[{q.marks}M]</span>
                        </div>
                      </div>
                      {q.options?.map((opt, oi) => (
                        <p key={oi} style={{ fontSize: 11, color: '#374151', margin: '3px 0 3px 8px', fontFamily: 'inherit' }}>{opt}</p>
                      ))}
                      {!q.options && (
                        <div style={{ marginTop: 6 }}>
                          {Array.from({ length: Math.max(2, Math.round(q.marks * 1.5)) }).map((_, li) => (
                            <div key={li} style={{ borderBottom: '1px solid #D1D5DB', height: 20, marginBottom: 4 }} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Answer Key */}
          {generatedPaper.answerKey?.length > 0 && (
            <div style={{ marginTop: 22, paddingTop: 16, borderTop: `2px solid ${C.dark}` }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.dark, margin: '0 0 10px', fontFamily: 'sans-serif' }}>Answer Key</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                {generatedPaper.answerKey.map((ans, i) => (
                  <div key={i} style={{ fontSize: 10, color: C.dark, marginBottom: 4, display: 'flex', gap: 5, lineHeight: 1.6, fontFamily: 'sans-serif' }}>
                    <span style={{ fontWeight: 700, flexShrink: 0, minWidth: 40 }}>{ans.number}. ({ans.section})</span>
                    <span style={{ color: '#374151' }}>{ans.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return null
}
