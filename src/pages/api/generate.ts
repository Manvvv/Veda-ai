import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, Fields, Files } from 'formidable'
import fs from 'fs'
import Groq from 'groq-sdk'
import { PDFParse } from 'pdf-parse'

export const config = { api: { bodyParser: false } }

const PROGRESS_STEPS = [
  'Receiving your request...',
  'Parsing uploaded reference file...',
  'Structuring AI prompt...',
  'Generating questions with Gemini AI...',
  'Parsing and validating response...',
  'Finalizing paper structure...',
]

function emitProgress(req: NextApiRequest, step: number, message: string) {
  try {
    const io = (req.socket as any)?.server?.io
    if (io) io.emit('generation:progress', { step, message, total: PROGRESS_STEPS.length })
  } catch {}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    emitProgress(req, 0, PROGRESS_STEPS[0])

    // Parse multipart form
    const form = new IncomingForm({ maxFileSize: 10 * 1024 * 1024, keepExtensions: true })
    const [fields, files]: [Fields, Files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve([fields, files])))
    })

    const subject = (fields.subject as string[])?.[0] || 'General'
    const classGrade = (fields.classGrade as string[])?.[0] || 'Class 8'
    const school = (fields.school as string[])?.[0] || 'School'
    const timeAllowed = (fields.timeAllowed as string[])?.[0] || '60'
    const additionalInstructions = (fields.additionalInstructions as string[])?.[0] || ''
    const questionTypesRaw = (fields.questionTypes as string[])?.[0] || '[]'
    const questionTypes: { type: string; count: number; marks: number }[] = JSON.parse(questionTypesRaw)

    // Validate
    if (!subject.trim() || !classGrade.trim()) {
      return res.status(400).json({ error: 'Subject and Class/Grade are required.' })
    }
    if (!questionTypes.length) {
      return res.status(400).json({ error: 'At least one question type is required.' })
    }
    for (const qt of questionTypes) {
      if (qt.count < 1 || qt.marks < 1) {
        return res.status(400).json({ error: 'Question count and marks must be at least 1.' })
      }
    }

    emitProgress(req, 1, PROGRESS_STEPS[1])

    // Extract text from uploaded PDF/text file
    let referenceText = ''
    const uploadedFile = files.file
    const fileObj = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile
    if (fileObj && fileObj.size > 0) {
      const fileBuffer = fs.readFileSync(fileObj.filepath)
      const fname = (fileObj.originalFilename || '').toLowerCase()
      if (fname.endsWith('.pdf')) {
        try {
          const pdfData = await new PDFParse(fileBuffer).parse()
          referenceText = pdfData.text.trim().slice(0, 7000)
        } catch (e) {
          console.warn('PDF parse error:', e)
        }
      } else {
        referenceText = fileBuffer.toString('utf-8').slice(0, 7000)
      }
    }

    emitProgress(req, 2, PROGRESS_STEPS[2])

    const totalMarks = questionTypes.reduce((s, qt) => s + qt.count * qt.marks, 0)
    const qtFormatted = questionTypes
      .map((qt, i) => `Section ${String.fromCharCode(65 + i)}: ${qt.type} — ${qt.count} questions × ${qt.marks} marks each`)
      .join('\n')

    const referenceSection = referenceText
      ? `\nYou MUST base ALL questions strictly on this reference material:\n---\n${referenceText}\n---\n`
      : `\nGenerate educationally relevant questions for ${subject} at the ${classGrade} level based on standard curriculum.\n`

    const prompt = `You are an expert Indian school examination paper setter with 20 years of experience.

Your task: Create a complete, professional question paper.
${referenceSection}
Subject: ${subject}
Class/Grade: ${classGrade}
School: ${school}
Time Allowed: ${timeAllowed} minutes
Total Marks: ${totalMarks}
${additionalInstructions ? `Special Instructions from Teacher: ${additionalInstructions}` : ''}

Required sections (generate EXACTLY these questions):
${qtFormatted}

STRICT RULES — MUST FOLLOW:
1. Every question text must be COMPLETELY DIFFERENT and test a distinct concept/fact.
2. Questions must progress logically: Easy → Moderate → Hard within each section.
3. Multiple Choice (MCQ): Provide exactly 4 options (A, B, C, D). Make 3 plausible distractors. Correct answer must be factually accurate.
4. True/False: Write clear, unambiguous statements that are definitively true OR false.
5. Short Answer: Ask for specific facts, definitions, or brief explanations (2-3 sentences expected).
6. Long Answer: Ask for analysis, explanation with examples, or comparison (one full paragraph+ expected).
7. Fill in the Blanks: Provide complete sentences with ONE blank each.
8. Match the Following: Provide exactly 5 column A items and 5 column B items.
9. Numerical Problems: Provide all necessary data values in the question.
10. difficulty field: MUST be exactly "Easy", "Moderate", or "Hard" (case-sensitive).
11. Do NOT repeat any question text across sections.

Respond with ONLY valid JSON — no markdown fences, no explanation:
{
  "subject": "${subject}",
  "class": "${classGrade}",
  "school": "${school}",
  "timeAllowed": "${timeAllowed} minutes",
  "maxMarks": ${totalMarks},
  "sections": [
    {
      "title": "Section A: Multiple Choice Questions",
      "questionType": "Multiple Choice Questions",
      "instruction": "Choose the most appropriate option. Each question carries X marks.",
      "questions": [
        {
          "number": 1,
          "text": "Unique, specific question text based on the subject matter?",
          "difficulty": "Easy",
          "marks": 2,
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."]
        }
      ]
    }
  ],
  "answerKey": [
    { "number": 1, "section": "A", "answer": "The correct and complete answer." }
  ]
}`

    emitProgress(req, 3, PROGRESS_STEPS[3])

   
const GROQ_API_KEY = process.env.GROQ_API_KEY || ''

if (!GROQ_API_KEY) {
  return res.status(500).json({
    error:
      'GROQ_API_KEY is not set in .env.local',
  })
}

const client = new Groq({
  apiKey: GROQ_API_KEY,
})

let paper = null

try {
  console.log('Attempting Groq AI')

  const completion = await client.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.85,
    max_tokens: 8192,
  })

  const raw = completion.choices?.[0]?.message?.content || ''

  if (!raw) {
    throw new Error('Empty response from Groq')
  }

  const clean = raw
    .replace(/^```json\s*|^```\s*|```\s*$/gm, '')
    .trim()

  paper = JSON.parse(clean)

  console.log('✓ Groq AI succeeded')
} catch (e: any) {
  console.error('Groq API error:', e)

  return res.status(500).json({
    error: e.message || 'Groq generation failed',
  })
}

  

    emitProgress(req, 4, PROGRESS_STEPS[4])

    emitProgress(req, 5, PROGRESS_STEPS[5])

    // Clean up temp file
    if (fileObj?.filepath) {
      try { fs.unlinkSync(fileObj.filepath) } catch {}
    }

    emitProgress(req, 6, 'Paper ready!')

    return res.status(200).json({ paper })
  } catch (err: any) {
    console.error('Generation error:', err)
    return res.status(500).json({ error: err.message || 'Failed to generate paper' })
  }
}
