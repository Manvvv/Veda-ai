export interface User {
  name: string
  email: string
  school: string
  initials: string
  avatarColor: string
}

export interface QuestionType {
  type: string
  count: number
  marks: number
}

export interface AssignmentForm {
  subject: string
  classGrade: string
  school: string
  dueDate: string
  questionTypes: QuestionType[]
  additionalInstructions: string
  timeAllowed: number
}

export interface Assignment {
  id: number
  title: string
  assignedOn: string
  due: string
}

export interface Question {
  number: number
  text: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  marks: number
  options?: string[]
}

export interface Section {
  title: string
  questionType: string
  instruction: string
  questions: Question[]
}

export interface AnswerKey {
  number: number
  section: string
  answer: string
}

export interface GeneratedPaper {
  subject: string
  class: string
  school: string
  timeAllowed: string
  maxMarks: number
  sections: Section[]
  answerKey: AnswerKey[]
}

export interface Group {
  id: number
  name: string
  students: number
  color: string
  initials: string
  subject: string
  lastActive: string
}

export interface LibraryFile {
  id: number
  title: string
  type: string
  date: string
  size: string
  icon: string
}

export interface ToolkitTool {
  id: number
  icon: string
  title: string
  desc: string
  color: string
  badge: string
}
