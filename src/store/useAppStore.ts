import { create } from 'zustand'
import { User, Assignment, GeneratedPaper } from '@/utils/types'

interface GenerationProgress {
  step: number
  message: string
  status: 'idle' | 'running' | 'done' | 'error'
}

interface AppState {
  // Auth
  user: User | null
  isAuthed: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void

  // Navigation
  page: string
  setPage: (page: string) => void

  // Assignments
  assignments: Assignment[]
  addAssignment: (a: Assignment) => void
  removeAssignment: (id: number) => void

  // Generated Paper
  generatedPaper: GeneratedPaper | null
  setGeneratedPaper: (paper: GeneratedPaper | null) => void

  // Generation Progress (real-time)
  generationProgress: GenerationProgress
  setGenerationProgress: (p: Partial<GenerationProgress>) => void
  resetGenerationProgress: () => void

  // WS status
  wsConnected: boolean
  setWsConnected: (v: boolean) => void
}

const defaultProgress: GenerationProgress = {
  step: 0,
  message: 'Initializing...',
  status: 'idle',
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthed: false,
  login: (user) => set({ user, isAuthed: true }),
  logout: () => set({ user: null, isAuthed: false, page: 'home', assignments: [], generatedPaper: null }),
  updateUser: (u) => set((s) => ({ user: s.user ? { ...s.user, ...u } : null })),

  page: 'home',
  setPage: (page) => set({ page }),

  assignments: [],
  addAssignment: (a) => set((s) => ({ assignments: [a, ...s.assignments] })),
  removeAssignment: (id) => set((s) => ({ assignments: s.assignments.filter((x) => x.id !== id) })),

  generatedPaper: null,
  setGeneratedPaper: (paper) => set({ generatedPaper: paper }),

  generationProgress: defaultProgress,
  setGenerationProgress: (p) => set((s) => ({ generationProgress: { ...s.generationProgress, ...p } })),
  resetGenerationProgress: () => set({ generationProgress: defaultProgress }),

  wsConnected: false,
  setWsConnected: (v) => set({ wsConnected: v }),
}))
