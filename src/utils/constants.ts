export const C = {
  orange: '#E55A2B',
  dark: '#1A1A1A',
  bg: '#F5F4F0',
  card: '#FFFFFF',
  border: '#E5E3DC',
  muted: '#8E8C84',
  green: '#16A34A',
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',
  infoText: '#1E40AF',
  purple: '#7C3AED',
  blue: '#2563EB',
  red: '#DC2626',
  yellow: '#D97706',
}

export const QUESTION_TYPES = [
  'Multiple Choice Questions',
  'Short Answer Questions',
  'Long Answer Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False Questions',
  'Fill in the Blanks',
  'Match the Following',
]

export const DIFFICULTY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Easy: { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' },
  Moderate: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  Hard: { bg: '#FCE7F3', text: '#831843', border: '#F9A8D4' },
}

export const LOADING_STEPS = [
  'Structuring your prompt…',
  'Sending to AI engine…',
  'Generating questions…',
  'Organising sections…',
  'Formatting output…',
]

export const TOOLKIT_TOOLS = [
  { id: 1, icon: '📝', title: 'Question Generator', desc: 'Generate custom questions from any topic or document', color: '#E55A2B', badge: 'AI' },
  { id: 2, icon: '✅', title: 'Auto Grader', desc: 'Upload student answers and get instant AI grading', color: '#7C3AED', badge: 'AI' },
  { id: 3, icon: '📊', title: 'Performance Analyzer', desc: 'Analyze class performance and identify weak areas', color: '#2563EB', badge: 'Beta' },
  { id: 4, icon: '🎯', title: 'Rubric Builder', desc: 'Create detailed marking rubrics for any assignment', color: '#16A34A', badge: 'New' },
  { id: 5, icon: '💬', title: 'Feedback Writer', desc: 'Generate personalized student feedback at scale', color: '#D97706', badge: 'AI' },
  { id: 6, icon: '📚', title: 'Lesson Planner', desc: 'AI-powered lesson plans aligned to curriculum standards', color: '#DC2626', badge: 'Beta' },
]

export const MOCK_GROUPS = [
  { id: 1, name: 'Grade 8 - Science', students: 32, color: '#E55A2B', initials: 'G8', subject: 'Science', lastActive: '2 hours ago' },
  { id: 2, name: 'Grade 10 - Math', students: 28, color: '#7C3AED', initials: 'G10', subject: 'Mathematics', lastActive: 'Yesterday' },
  { id: 3, name: 'Grade 5 - English', students: 35, color: '#2563EB', initials: 'G5', subject: 'English', lastActive: '3 days ago' },
  { id: 4, name: 'Grade 12 - Physics', students: 24, color: '#16A34A', initials: 'G12', subject: 'Physics', lastActive: '1 week ago' },
]

export const MOCK_LIBRARY = [
  { id: 1, title: 'NCERT Science Grade 8 - Chapter 5', type: 'PDF', date: '20-05-2025', size: '2.4 MB', icon: '📄' },
  { id: 2, title: 'Electricity Quiz Reference', type: 'Text', date: '18-05-2025', size: '45 KB', icon: '📝' },
  { id: 3, title: 'Math Formula Sheet Grade 10', type: 'PDF', date: '15-05-2025', size: '1.1 MB', icon: '📄' },
  { id: 4, title: 'English Grammar Notes', type: 'Text', date: '10-05-2025', size: '120 KB', icon: '📝' },
  { id: 5, title: 'Physics Diagrams Collection', type: 'Image', date: '05-05-2025', size: '8.2 MB', icon: '🖼' },
]

export const RECENT_ACTIVITY = [
  { text: 'Assignment created: Quiz on Electricity', time: '2 hours ago', icon: '📋' },
  { text: 'Grade 8 Science paper generated', time: 'Yesterday', icon: '✨' },
  { text: '5 students submitted assignments', time: '2 days ago', icon: '👥' },
  { text: 'Library updated with NCERT Chapter 6', time: '1 week ago', icon: '📚' },
]
