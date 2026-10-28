import { useEffect, useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, RefreshCw } from 'lucide-react'
import type { SiteContent, CastCrewEntry, GalleryItem } from '../../lib/content'
import { Field, TextInput, TextArea, Toggle, Btn, Card } from './AdminUI'
import MediaPicker from './MediaPicker'
import { listMedia, deleteMedia, uploadMedia } from '../../lib/admin'

type Update = (patch: Partial<SiteContent>) => void

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

/* ---------------- General ---------------- */
export function GeneralSection({ c, update }: { c: SiteContent; update: Update }) {
  return (
    <div className="space-y-5">
      <Card title="Film identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Film title"><TextInput value={c.filmTitle} onChange={(e) => update({ filmTitle: e.target.value })} /></Field>
          <Field label="Genre"><TextInput value={c.genre} onChange={(e) => update({ genre: e.target.value })} /></Field>
          <Field label="Language"><TextInput value={c.language} onChange={(e) => update({ language: e.target.value })} /></Field>
          <Field label="Runtime"><TextInput value={c.runtime} onChange={(e) => update({ runtime: e.target.value })} /></Field>
          <Field label="Release date (display)"><TextInput value={c.releaseDate} onChange={(e) => update({ releaseDate: e.target.value })} /></Field>
          <Field label="Release message (shown at countdown zero)"><TextInput value={c.releaseMessage} onChange={(e) => update({ releaseMessage: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Tagline"><TextInput value={c.tagline} onChange={(e) => update({ tagline: e.target.value })} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Synopsis"><TextArea value={c.synopsis} onChange={(e) => update({ synopsis: e.target.value })} /></Field>
        </div>
      </Card>
      <Card title="SEO & social sharing">
        <div className="grid gap-4">
          <Field label="Page title"><TextInput value={c.pageTitle} onChange={(e) => update({ pageTitle: e.target.value })} /></Field>
          <Field label="SEO description"><TextArea value={c.seoDescription} onChange={(e) => update({ seoDescription: e.target.value })} /></Field>
          <MediaPicker label="Social sharing image" kind="image" value={c.socialImageUrl} onChange={(v) => update({ socialImageUrl: v })} />
        </div>
      </Card>
      <Card title="External links">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Instagram URL"><TextInput value={c.instagramUrl} onChange={(e) => update({ instagramUrl: e.target.value })} placeholder="https://instagram.com/..." /></Field>
          <Field label="IMDb URL"><TextInput value={c.imdbUrl} onChange={(e) => update({ imdbUrl: e.target.value })} placeholder="https://imdb.com/title/..." /></Field>
        </div>
        <div className="mt-4">
          <Field label="Footer copyright"><TextInput value={c.copyright} onChange={(e) => update({ copyright: e.target.value })} /></Field>
        </div>
      </Card>
    </div>
  )
}

/* ---------------- Hero & trailer ---------------- */
export function HeroSection({ c, update }: { c: SiteContent; update: Update }) {
  return (
    <div className="space-y-5">
      <Card title="Trailer & poster media">
        <div className="grid gap-5">
          <MediaPicker label="Background trailer video" kind="video" value={c.trailerVideoUrl} onChange={(v) => update({ trailerVideoUrl: v })} />
          <MediaPicker label="Official poster" kind="image" value={c.posterUrl} onChange={(v) => update({ posterUrl: v })} />
          <MediaPicker label="Fallback poster (shown if video fails)" kind="image" value={c.posterFallbackUrl} onChange={(v) => update({ posterFallbackUrl: v })} />
        </div>
      </Card>
      <Card title="Trailer call to action">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Trailer button text"><TextInput value={c.trailerButtonText} onChange={(e) => update({ trailerButtonText: e.target.value })} /></Field>
          <Field label="YouTube trailer URL" hint="Full video URL — never the YouTube homepage"><TextInput value={c.youtubeUrl} onChange={(e) => update({ youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></Field>
          <Field label="Secondary (discover) button text"><TextInput value={c.discoverButtonText} onChange={(e) => update({ discoverButtonText: e.target.value })} /></Field>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Btn
            type="button"
            variant="ghost"
            disabled={!c.youtubeUrl}
            onClick={() => c.youtubeUrl && window.open(c.youtubeUrl, '_blank', 'noopener,noreferrer')}
          >
            Demo this button
          </Btn>
          <span className="text-xs text-muted">{c.youtubeUrl ? 'Opens the configured trailer link in a new tab.' : 'Add a URL above to enable the demo.'}</span>
        </div>
      </Card>
      <Card title="Full film button (appears when the countdown reaches zero)">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Film button text"><TextInput value={c.filmButtonText} onChange={(e) => update({ filmButtonText: e.target.value })} /></Field>
          <Field label="Short film URL" hint="Full video URL opened by the button — never the YouTube homepage"><TextInput value={c.filmUrl} onChange={(e) => update({ filmUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></Field>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Btn
            type="button"
            variant="ghost"
            disabled={!c.filmUrl}
            onClick={() => c.filmUrl && window.open(c.filmUrl, '_blank', 'noopener,noreferrer')}
          >
            Demo this button
          </Btn>
          <span className="text-xs text-muted">{c.filmUrl ? 'Opens the configured link in a new tab.' : 'Add a URL above to enable the demo.'}</span>
        </div>
      </Card>
      <Card title="Playback & overlay">
        <div className="flex flex-col gap-4">
          <Toggle checked={c.muteByDefault} onChange={(v) => update({ muteByDefault: v })} label="Start trailer muted by default" />
          <Field label={`Overlay darkness (${Math.round(c.overlayOpacity * 100)}%)`} hint="Gradient layer over the video to keep text readable">
            <input type="range" min={0} max={0.8} step={0.02} value={c.overlayOpacity} onChange={(e) => update({ overlayOpacity: Number(e.target.value) })} className="w-full accent-red" />
          </Field>
          <Field label={`Glass blur (${c.heroBlur}px)`} hint="Frosted-glass blur applied to the trailer behind the text">
            <input type="range" min={0} max={16} step={1} value={c.heroBlur} onChange={(e) => update({ heroBlur: Number(e.target.value) })} className="w-full accent-red" />
          </Field>
          <Field label={`Dark tint (${Math.round(c.heroTint * 100)}%)`} hint="Dark glass tint layer over the trailer">
            <input type="range" min={0} max={0.9} step={0.02} value={c.heroTint} onChange={(e) => update({ heroTint: Number(e.target.value) })} className="w-full accent-red" />
          </Field>
        </div>
      </Card>
      <Card title="Countdown settings">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Target date & time (with timezone offset)" hint="ISO 8601, e.g. 2026-11-19T12:00:00+05:30 for IST noon">
            <TextInput value={c.countdownTargetIso} onChange={(e) => update({ countdownTargetIso: e.target.value })} />
          </Field>
          <Field label="Timezone label (display)"><TextInput value={c.countdownTimezoneLabel} onChange={(e) => update({ countdownTimezoneLabel: e.target.value })} /></Field>
        </div>
        <p className="mt-3 text-xs text-muted">Preview: {new Date(c.countdownTargetIso).toString() === 'Invalid Date' ? '⚠️ invalid date' : new Date(c.countdownTargetIso).toLocaleString()}</p>
      </Card>
    </div>
  )
}

/* ---------------- Technical ---------------- */
export function TechSection({ c, update }: { c: SiteContent; update: Update }) {
  const t = c.tech
  const set = (k: keyof SiteContent['tech'], v: string) => update({ tech: { ...t, [k]: v } })
  const fields: [keyof SiteContent['tech'], string][] = [
    ['runtime', 'Runtime'], ['language', 'Language'], ['resolution', 'Resolution'], ['aspectRatio', 'Aspect ratio'],
    ['frameRate', 'Frame rate'], ['camera', 'Camera'], ['audioFormat', 'Audio format'], ['cinematography', 'Cinematography'],
    ['editing', 'Editing'], ['colorGrading', 'Color grading'], ['postProduction', 'Post-production'],
  ]
  return (
    <Card title="Technical specifications">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([k, label]) => (
          <Field key={k} label={label}><TextInput value={t[k]} onChange={(e) => set(k, e.target.value)} /></Field>
        ))}
      </div>
    </Card>
  )
}

/* ---------------- Cast & crew ---------------- */
export function CastSection({ c, update }: { c: SiteContent; update: Update }) {
  const list = c.castCrew
  const setList = (next: CastCrewEntry[]) => update({ castCrew: next })
  const add = () => setList([...list, { id: uid(), name: '', role: '', category: 'cast' }])
  const edit = (id: string, patch: Partial<CastCrewEntry>) => setList(list.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  const remove = (id: string) => setList(list.filter((e) => e.id !== id))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    setList(next)
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{list.length} entries</p>
        <Btn onClick={add}><Plus size={15} /> Add entry</Btn>
      </div>
      {list.map((e, i) => (
        <Card key={e.id}>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">#{i + 1}</span>
            <div className="flex gap-1">
              <button onClick={() => move(i, -1)} className="rounded-sm border border-line p-1.5 hover:border-red" aria-label="Move up"><ArrowUp size={14} /></button>
              <button onClick={() => move(i, 1)} className="rounded-sm border border-line p-1.5 hover:border-red" aria-label="Move down"><ArrowDown size={14} /></button>
              <button onClick={() => remove(e.id)} className="rounded-sm border border-line p-1.5 text-red hover:bg-red hover:text-white" aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><TextInput value={e.name} onChange={(ev) => edit(e.id, { name: ev.target.value })} /></Field>
            <Field label="Role" hint="e.g. Director, Lead Actor, Cinematographer"><TextInput value={e.role} onChange={(ev) => edit(e.id, { role: ev.target.value })} /></Field>
            <Field label="Character name (optional)"><TextInput value={e.character ?? ''} onChange={(ev) => edit(e.id, { character: ev.target.value })} /></Field>
            <Field label="Category">
              <select value={e.category} onChange={(ev) => edit(e.id, { category: ev.target.value as 'cast' | 'crew' })} className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-red">
                <option value="cast">Cast</option>
                <option value="crew">Crew</option>
              </select>
            </Field>
            <Field label="Social link (optional)"><TextInput value={e.socialUrl ?? ''} onChange={(ev) => edit(e.id, { socialUrl: ev.target.value })} /></Field>
            <div className="sm:col-span-1"><MediaPicker label="Profile photo" kind="image" value={e.photoUrl ?? ''} onChange={(v) => edit(e.id, { photoUrl: v })} /></div>
            <div className="sm:col-span-2"><Field label="Biography (optional)"><TextArea value={e.bio ?? ''} onChange={(ev) => edit(e.id, { bio: ev.target.value })} /></Field></div>
          </div>
        </Card>
      ))}
      {list.length === 0 && <p className="rounded-sm border border-dashed border-line p-8 text-center text-sm text-muted">No cast or crew yet. Add the real credits — don't invent names.</p>}
    </div>
  )
}

/* ---------------- Gallery ---------------- */
export function GallerySection({ c, update }: { c: SiteContent; update: Update }) {
  const list = c.gallery
  const setList = (next: GalleryItem[]) => update({ gallery: next })
  const edit = (id: string, patch: Partial<GalleryItem>) => setList(list.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  const remove = (id: string) => setList(list.filter((g) => g.id !== id))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    setList(next)
  }
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const handleFiles = async (files: FileList) => {
    setBusy(true)
    const all = Array.from(files)
    const added: GalleryItem[] = []
    let skipped = 0
    for (let i = 0; i < all.length; i++) {
      setProgress(`Uploading ${i + 1} of ${all.length}…`)
      try {
        const res = await uploadMedia(all[i], 'image')
        added.push({ id: uid(), url: res.url, caption: '', alt: '' })
      } catch {
        skipped++
      }
    }
    setList([...list, ...added])
    setProgress(skipped > 0 ? `${added.length} added, ${skipped} skipped (invalid type or too large).` : '')
    setBusy(false)
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{list.length} {list.length === 1 ? 'still' : 'stills'} — add as many as you like.</p>
      </div>
      <Card>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-line py-8 text-sm text-muted hover:border-red">
          {busy ? <Loader2 className="animate-spin" /> : <Plus />}
          {busy ? (progress || 'Uploading…') : 'Upload images (select multiple — no limit)'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        </label>
        {!busy && progress && <p className="mt-2 text-center text-xs text-muted">{progress}</p>}
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((g, i) => (
          <Card key={g.id}>
            <div className="flex gap-4">
              <img src={g.url} alt="" className="h-24 w-24 shrink-0 rounded-sm border border-line object-cover" />
              <div className="flex-1 space-y-2">
                <Field label="Caption"><TextInput value={g.caption ?? ''} onChange={(e) => edit(g.id, { caption: e.target.value })} /></Field>
                <Field label="Alt text"><TextInput value={g.alt ?? ''} onChange={(e) => edit(g.id, { alt: e.target.value })} /></Field>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1">
              <button onClick={() => move(i, -1)} className="rounded-sm border border-line p-1.5 hover:border-red" aria-label="Move up"><ArrowUp size={14} /></button>
              <button onClick={() => move(i, 1)} className="rounded-sm border border-line p-1.5 hover:border-red" aria-label="Move down"><ArrowDown size={14} /></button>
              <button onClick={() => remove(g.id)} className="rounded-sm border border-line p-1.5 text-red hover:bg-red hover:text-white" aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Media library ---------------- */
export function MediaLibrarySection() {
  const [items, setItems] = useState<{ name: string; url: string; path: string; folder: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    setItems(await listMedia())
    setLoading(false)
  }
  useEffect(() => { refresh() }, [])

  const doDelete = async (path: string) => {
    await deleteMedia(path)
    setConfirm(null)
    refresh()
  }

  return (
    <Card title="Media library">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} files in Supabase Storage</p>
        <Btn variant="ghost" onClick={refresh}><RefreshCw size={14} /> Refresh</Btn>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted"><Loader2 className="animate-spin" size={16} /> Loading…</div>
      ) : items.length === 0 ? (
        <p className="rounded-sm border border-dashed border-line p-8 text-center text-sm text-muted">No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((m) => (
            <div key={m.path} className="overflow-hidden rounded-sm border border-line">
              <div className="aspect-square bg-offwhite">
                {m.folder === 'images' ? (
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <video src={m.url} className="h-full w-full object-cover" muted />
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-ink" title={m.name}>{m.name}</p>
                {confirm === m.path ? (
                  <div className="mt-1 flex gap-1">
                    <button onClick={() => doDelete(m.path)} className="flex-1 rounded-sm bg-red px-2 py-1 text-xs font-semibold text-white">Confirm</button>
                    <button onClick={() => setConfirm(null)} className="flex-1 rounded-sm border border-line px-2 py-1 text-xs">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirm(m.path)} className="mt-1 text-xs font-semibold text-red hover:underline">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
