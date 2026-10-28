import { useCallback, useEffect, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { AlertTriangle, ExternalLink, FileText, Loader2, Lock, LogOut } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getAdminUser } from '../lib/admin'

const CONTENT_EDIT_URL = 'https://github.com/dsframeworks/iamhereshortfilm/edit/main/src/content/siteContent.ts'
const REPOSITORY_URL = 'https://github.com/dsframeworks/iamhereshortfilm'

export default function Admin() {
  const [phase, setPhase] = useState<'loading' | 'login' | 'dashboard'>('loading')
  const [user, setUser] = useState<User | null>(null)

  const check = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setPhase('login')
      return
    }
    const admin = await getAdminUser()
    if (admin) {
      setUser(admin)
      setPhase('dashboard')
    } else {
      setUser(null)
      setPhase('login')
    }
  }, [])

  useEffect(() => {
    void check()
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange(() => void check())
    return () => data.subscription.unsubscribe()
  }, [check])

  if (phase === 'loading') {
    return <div className="flex min-h-screen items-center justify-center bg-ivory"><Loader2 className="animate-spin text-red" size={28} /></div>
  }
  if (phase === 'login') return <Login onAuthed={check} />
  return <Dashboard user={user} onLogout={() => { void supabase?.auth.signOut(); setPhase('login') }} />
}

function Login({ onAuthed }: { onAuthed: () => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    if (!supabase) {
      setErrorMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then follow SETUP.md.')
      return
    }
    setBusy(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw error
      const admin = await getAdminUser()
      if (!admin) {
        await supabase.auth.signOut()
        throw new Error('This account is not authorized as an admin.')
      }
      await onAuthed()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Sign in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper"><Lock size={20} className="text-red" /></div>
          <h1 className="text-2xl font-light tracking-tight text-ink">I'M HERE — Admin</h1>
          <p className="mt-1 text-sm text-muted">Authorized access only</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-sm border border-line bg-paper p-6">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Email</span>
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-sm border border-line bg-ivory px-3 py-2 text-sm outline-none focus:border-red" autoComplete="email" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Password</span>
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-sm border border-line bg-ivory px-3 py-2 text-sm outline-none focus:border-red" autoComplete="current-password" />
          </label>
          {errorMessage && <div className="flex items-start gap-2 rounded-sm bg-red/10 p-3 text-xs text-red-deep"><AlertTriangle size={14} className="mt-0.5 shrink-0" /><span>{errorMessage}</span></div>}
          <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-sm bg-red px-4 py-2.5 text-sm font-medium text-white hover:bg-red-deep disabled:opacity-60">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />} Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">Accounts are created by the project owner in Supabase. There is no public registration.</p>
      </div>
    </div>
  )
}

function Dashboard({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header className="border-b border-line bg-paper/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-lg font-light tracking-tight text-ink">I'M HERE — Dashboard</h1>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
          <button onClick={onLogout} className="rounded-sm border border-line p-2 text-charcoal hover:border-red hover:text-red" aria-label="Log out"><LogOut size={16} /></button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <section className="rounded-sm border border-line bg-paper p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <FileText className="text-red" size={22} />
            <h2 className="text-xl font-light text-ink">Manage site content in GitHub</h2>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Supabase is used for administrator sign-in only. Text, settings, stills, and the trailer are stored in this repository. Edit the content file and commit the change to <code>main</code>; GitHub Actions will build and deploy the site.
          </p>
          <a href={CONTENT_EDIT_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-sm bg-red px-4 py-2.5 text-sm font-medium text-white hover:bg-red-deep">
            Edit content file in GitHub <ExternalLink size={15} />
          </a>
          <p className="mt-4 text-xs leading-5 text-muted">
            Content file: <code>src/content/siteContent.ts</code><br />
            Media folders: <code>public/media/stills/</code> and <code>public/media/trailer/</code>
          </p>
          <div className="mt-6 border-t border-line pt-5 text-sm leading-6 text-muted">
            In-dashboard publishing is not configured. A secure server-side GitHub App or function would be needed to publish edits directly from this screen; no GitHub credential is stored in the browser.
          </div>
        </section>
        <a href={REPOSITORY_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-muted hover:text-red">Open repository <ExternalLink size={14} /></a>
      </main>
    </div>
  )
}
