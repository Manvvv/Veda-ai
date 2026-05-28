import type { NextPage } from 'next'
import Head from 'next/head'
import { useAppStore } from '@/store/useAppStore'
import LoginPage from '@/components/LoginPage'
import Sidebar from '@/components/Sidebar'
import HomePage from '@/components/HomePage'
import GroupsPage from '@/components/GroupsPage'
import AssignmentsPage from '@/components/AssignmentsPage'
import ToolkitPage from '@/components/ToolkitPage'
import LibraryPage from '@/components/LibraryPage'
import SettingsPage from '@/components/SettingsPage'

const Home: NextPage = () => {
  const { user, isAuthed, login, logout, updateUser, page, setPage, assignments, addAssignment, generatedPaper, setGeneratedPaper } = useAppStore()

  if (!isAuthed || !user) {
    return (
      <>
        <Head><title>VedaAI – AI Assessment Creator</title></Head>
        <LoginPage onLogin={login} />
      </>
    )
  }

  const setAssignments = (fn: (prev: typeof assignments) => typeof assignments) => {
    const updated = fn(assignments)
    useAppStore.setState({ assignments: updated })
  }

  const pageContent: Record<string, React.ReactNode> = {
    home: <HomePage user={user} assignments={assignments} setPage={setPage} />,
    groups: <GroupsPage user={user} />,
    assignments: <AssignmentsPage user={user} assignments={assignments} setAssignments={setAssignments} generatedPaper={generatedPaper} setGeneratedPaper={setGeneratedPaper} />,
    create: <AssignmentsPage user={user} assignments={assignments} setAssignments={setAssignments} generatedPaper={generatedPaper} setGeneratedPaper={setGeneratedPaper} />,
    toolkit: <ToolkitPage user={user} />,
    library: <LibraryPage user={user} />,
    settings: <SettingsPage user={user} setUser={(fn) => updateUser(fn(user))} onLogout={logout} />,
  }

  return (
    <>
      <Head>
        <title>VedaAI – AI Assessment Creator</title>
        <meta name="description" content="AI-powered assessment platform for educators" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F5F4F0', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <Sidebar page={page} setPage={setPage} onLogout={logout} user={user} assignmentsCount={assignments.length} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {pageContent[page] || pageContent['home']}
        </div>
      </div>
    </>
  )
}

export default Home
