import { useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { uploadMedia } from '../../lib/admin'
import { Btn } from './AdminUI'

interface Props {
  label: string
  value: string
  kind: 'image' | 'video'
  onChange: (url: string) => void
}

export default function MediaPicker({ label, value, kind, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [pct, setPct] = useState(0)
  const [err, setErr] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setErr(null)
    setBusy(true)
    setPct(0)
    try {
      const res = await uploadMedia(file, kind, setPct)
      onChange(res.url)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      <div className="mt-2 flex items-start gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-line bg-offwhite">
          {value ? (
            kind === 'image' ? (
              <img src={value} alt="" className="h-full w-full object-cover" />
            ) : (
              <video src={value} className="h-full w-full object-cover" muted />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted">None</div>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept={kind === 'image' ? 'image/*' : 'video/*'}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
              e.target.value = ''
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Btn type="button" variant="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {busy ? `Uploading ${pct}%` : value ? 'Replace' : 'Upload'}
            </Btn>
            {value && (
              <Btn type="button" variant="subtle" onClick={() => onChange('')} disabled={busy}>
                Remove
              </Btn>
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste a URL"
            className="mt-2 w-full rounded-sm border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-red"
          />
          {busy && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full bg-red transition-all" style={{ width: `${pct}%` }} />
            </div>
          )}
          {err && <p className="mt-2 text-xs text-red">{err}</p>}
        </div>
      </div>
    </div>
  )
}
