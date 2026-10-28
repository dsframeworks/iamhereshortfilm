import { useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  Lock, LogOut, Loader2, Save, UploadCloud, Eye, Settings, Clapperboard,
  Sliders, Users, Images, FolderOpen, AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEFAULT_CONTENT, type SiteContent } from '../lib/content'
import { getAdminUser, loadContentRow, saveDraft, publishDraft } from '../lib/admin'
import { Btn } from '../components/admin/AdminUI'
import {
  GeneralSection, HeroSection, TechSection, CastSection, GallerySection, MediaLibrarySection,
} from '../components/admin/Sections'
import Hero from '../components/Hero'
import Synopsis from '../components/Synopsis'
import FilmDetails from '../components/FilmDetails'
import TechSpecs from '../components/TechSpecs'
import CastCrew from '../components/CastCrew'
import Gallery from '../components/Gallery'
import PosterSection from '../components/PosterSection'
import Footer from '../components/Footer'

type Tab = 'general' | 'hero' | 'tech' | 'cast' | 'gallery' | 'media'
const TABS: { id: Tab; label: string; icon: typeof Settings }[] = [
  { id: 'general', label: 'General settings', icon: Settings },
  { id: 'hero', label: 'Hero & trailer', icon: Clapperboard },
  { id: 'tech', label: 'Technical specs', icon: Sliders },
  { id: 'cast', label: 'Cast & crew', icon: Users },
  { id: 'gallery', label: 'Gallery & stills', icon: Images },
  { id: 'media', label: 'Media library', icon: FolderOpen },
]

type Toast = { kind: 'ok' | 'err'; msg: string } | null

export default function Admin() {
  const [phase, setPhase] = useState<'loading' | 'login' | 'dashboard'>('loading')
  const [user, setUser] = useState<User | null>(null)

  const check = useCallback(async () => {
    if (!isSupabaseConfigured) { setPhase('login'); return }
    const u = await getAdminUser()
    if (u) { setUser(u); setPhase('dashboard') }
    else { setPhase('login') }
  }, [])

  useEffect(() => {
    check()
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange(() => check())
    return () => data.subscription.unsubscribe()
  }, [check])

  if (phase === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <Loader2 className="animate-spin text-red" size={28} />
      </div>
    )
  }
  if (phase === 'login') return <Login onAuthed={check} />
  return <Dashboard user={user} onLogout={() => { supabase?.auth.signOut(); setPhase('login') }} />
}

/* ---------------- Login ---------------- */
function Login({ onAuthed }: { onAuthed: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!supabase) { setErr('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then follow SETUP.md.'); return }
    setBusy(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw error
      const admin = await getAdminUser()
      if (!admin) {
        await supabase.auth.signOut()
        throw new Error('This account is not authorized as an admin.')
      }
      onAuthed()
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Sign in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper">
            <Lock size={20} className="text-red" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-ink">I'M HERE — Admin</h1>
          <p className="mt-1 text-sm text-muted">Authorized access only</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-sm border border-line bg-paper p-6">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-sm border border-line bg-ivory px-3 py-2 text-sm outline-none focus:border-red" autoComplete="email" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-sm border border-line bg-ivory px-3 py-2 text-sm outline-none focus:border-red" autoComplete="current-password" />
          </label>
          {err && (
            <div className="flex items-start gap-2 rounded-sm bg-red/10 p-3 text-xs text-red-deep">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" /> <span>{err}</span>
            </div>
          )}
          <Btn type="submit" disabled={busy} className="w-full">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />} Sign in
          </Btn>
        </form>
        <p className="mt-4 text-center text-xs text-muted">Accounts are created only by the project owner in Supabase. There is no public registration.</p>
      </div>
    </div>
  )
}

/* ---------------- Dashboard ---------------- */
function Dashboard({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('general')
  const [draft, setDraft] = useState<SiteContent>(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [preview, setPreview] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [confirmPublish, setConfirmPublish] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const d = await loadContentRow('draft')
        setDraft(d)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const notify = (t: Toast) => {
    setToast(t)
    if (t) setTimeout(() => setToast(null), 4000)
  }
  const update = (patch: Partial<SiteContent>) => setDraft((d) => ({ ...d, ...patch }))

  const doSave = async () => {
    setSaving(true)
    try { await saveDraft(draft); notify({ kind: 'ok', msg: 'Draft saved to Supabase.' }) }
    catch (e) { notify({ kind: 'err', msg: e instanceof Error ? e.message : 'Save failed.' }) }
    finally { setSaving(false) }
  }
  const doPublish = async () => {
    setPublishing(true)
    setConfirmPublish(false)
    try { await publishDraft(draft); notify({ kind: 'ok', msg: 'Changes published live.' }) }
    catch (e) { notify({ kind: 'err', msg: e instanceof Error ? e.message : 'Publish failed.' }) }
    finally { setPublishing(false) }
  }

  if (preview) {
    return (
      <div>
        <div className="sticky top-0 z-50 flex items-center justify-between bg-ink px-4 py-2 text-sm text-white">
          <span className="flex items-center gap-2"><Eye size={15} /> Preview of unpublished draft</span>
          <Btn variant="ghost" className="border-white/40 text-white hover:text-white" onClick={() => setPreview(false)}>Exit preview</Btn>
        </div>
        <Hero content={draft} />
        <Synopsis content={draft} />
        <FilmDetails content={draft} />
        <TechSpecs content={draft} />
        <CastCrew content={draft} />
        <Gallery content={draft} />
        <PosterSection content={draft} />
        <Footer content={draft} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-lg font-light tracking-tight text-ink">I'M HERE — Dashboard</h1>
            <p className="text-xs text-muted">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={() => setPreview(true)}><Eye size={15} /><span className="hidden sm:inline">Preview</span></Btn>
            <Btn variant="subtle" onClick={doSave} disabled={saving}>{saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}<span className="hidden sm:inline">Save draft</span></Btn>
            <Btn onClick={() => setConfirmPublish(true)} disabled={publishing}>{publishing ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}<span className="hidden sm:inline">Publish</span></Btn>
            <button onClick={onLogout} className="rounded-sm border border-line p-2 text-charcoal hover:border-red hover:text-red" aria-label="Log out"><LogOut size={16} /></button>
          </div>
        </div>
      </header>

      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-sm px-4 py-3 text-sm text-white shadow-lg ${toast.kind === 'ok' ? 'bg-ink' : 'bg-red'}`}>
          {toast.kind === 'ok' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />} {toast.msg}
        </div>
      )}

      {confirmPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onClick={() => setConfirmPublish(false)}>
          <div className="w-full max-w-sm rounded-sm border border-line bg-paper p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-ink">Publish changes?</h3>
            <p className="mt-2 text-sm text-muted">This replaces the live website content with your current draft. Visitors will see it immediately.</p>
            <div className="mt-5 flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setConfirmPublish(false)}>Cancel</Btn>
              <Btn onClick={doPublish}>Yes, publish</Btn>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        {/* Sidebar */}
        <nav className="flex gap-2 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2.5 rounded-sm px-3 py-2.5 text-left text-sm font-medium transition-colors ${tab === t.id ? 'bg-red text-white' : 'text-charcoal hover:bg-offwhite'}`}>
                <Icon size={16} /> {t.label}
              </button>
            )
          })}
        </nav>

        {/* Content */}
        <main className="min-w-0 flex-1">
          {loading ? (
            <div className="flex items-center gap-2 py-20 text-sm text-muted"><Loader2 className="animate-spin" size={18} /> Loading draft…</div>
          ) : (
            <>
              {tab === 'general' && <GeneralSection c={draft} update={update} />}
              {tab === 'hero' && <HeroSection c={draft} update={update} />}
              {tab === 'tech' && <TechSection c={draft} update={update} />}
              {tab === 'cast' && <CastSection c={draft} update={update} />}
              {tab === 'gallery' && <GallerySection c={draft} update={update} />}
              {tab === 'media' && <MediaLibrarySection />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
