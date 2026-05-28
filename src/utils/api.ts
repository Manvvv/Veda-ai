import { AssignmentForm, GeneratedPaper } from '@/utils/types'

export async function generateQuestionPaper(form: AssignmentForm, file?: File | null): Promise<GeneratedPaper> {
  const formData = new FormData()
  formData.append('subject', form.subject)
  formData.append('classGrade', form.classGrade)
  formData.append('school', form.school)
  formData.append('timeAllowed', String(form.timeAllowed))
  formData.append('questionTypes', JSON.stringify(form.questionTypes))
  formData.append('additionalInstructions', form.additionalInstructions || '')
  if (file) {
    formData.append('file', file)
  }

  const res = await fetch('/api/generate', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Generation failed')
  }
  const data = await res.json()
  return data.paper as GeneratedPaper
}

export async function runToolkitTool(toolTitle: string, input: string): Promise<string> {
  const res = await fetch('/api/toolkit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolTitle, input }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Tool failed')
  }
  const data = await res.json()
  return data.result as string
}
