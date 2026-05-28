import type { NextApiRequest, NextApiResponse } from 'next'
import Groq from 'groq-sdk'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { toolTitle, input } = req.body
  if (!toolTitle || !input) return res.status(400).json({ error: 'toolTitle and input required' })

  const prompts: Record<string, string> = {
    'Question Generator': `You are an expert teacher. Generate 5 high-quality, DISTINCT educational questions for the topic: "${input}". 
Each question must test a DIFFERENT concept. Mix difficulty: Easy, Moderate, Hard.
Format your response as plain numbered text:
1. [Difficulty] Question text
2. [Difficulty] Question text
...
Do not add any headers or extra text.`,

    'Auto Grader': `You are an expert examiner. A student answered the following: "${input}"
Provide structured grading feedback:
- Estimated Score: X/10
- Strengths: (2-3 bullet points)
- Areas for Improvement: (2-3 bullet points)  
- Suggested Grade Feedback to Student: (1 encouraging paragraph)
Be concise and constructive.`,

    'Performance Analyzer': `You are an educational data analyst. Analyze this class/student performance data: "${input}"
Provide:
- Overall Performance Summary
- Key Strengths (top 3)
- Weak Areas (top 3)
- Actionable Recommendations for the teacher (3-4 steps)
Be specific and data-driven.`,

    'Rubric Builder': `You are a curriculum expert. Create a detailed grading rubric for: "${input}"
Include 4 criteria with 3 performance levels each (Excellent/Proficient/Developing).
Format:
Criterion 1: [Name] (X%)
- Excellent: ...
- Proficient: ...  
- Developing: ...
Repeat for all 4 criteria.`,

    'Feedback Writer': `You are a compassionate teacher. Write personalized, encouraging student feedback for: "${input}"
The feedback must:
- Start with a genuine compliment
- Address 2 specific strengths
- Suggest 2 concrete areas to improve
- End with a motivating closing statement
Keep it warm, professional, and under 150 words.`,

    'Lesson Planner': `You are a master educator. Create a detailed 45-minute lesson plan for: "${input}"
Include:
1. Learning Objectives (3 clear goals)
2. Materials Needed
3. Hook/Introduction (5 min)
4. Direct Instruction (15 min)
5. Guided Practice (15 min)
6. Independent Practice (5 min)
7. Assessment/Closure (5 min)
8. Homework Assignment
Be specific and actionable.`,
  }

  const prompt = prompts[toolTitle] || `You are an expert AI Teacher's assistant. Help with: "${input}" using the tool: "${toolTitle}". Provide a structured, professional, and highly useful response.`

  const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not set in .env.local' })
  }

  const client = new Groq({
    apiKey: GROQ_API_KEY,
  })
  const modelAttempts = ['llama-3.3-70b-versatile', 'llama-3.2-90b', 'llama-3.1-70b']
  let result = null
  let lastError = null

  try {
   for (const modelName of modelAttempts) {
  try {
    console.log(`Toolkit attempting model: ${modelName}`)

    const completion = await client.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    })

    result = completion.choices?.[0]?.message?.content || ''

    if (!result) {
      throw new Error('Empty response from Groq')
    }

    console.log(`✓ Toolkit model ${modelName} succeeded`)
    break
  } catch (e: any) {
    lastError = e.message || String(e)
    console.warn(`✗ Toolkit model ${modelName} failed: ${lastError}`)
  }
}

    if (!result) {
      console.error('Toolkit API final error:', lastError)
      return res.status(500).json({ error: `Toolkit failed. Error: ${lastError}` })
    }

    return res.status(200).json({ result })
  } catch (err: any) {
    console.error('Toolkit error:', err)
    return res.status(500).json({ error: err.message || 'Tool failed' })
  }
}
