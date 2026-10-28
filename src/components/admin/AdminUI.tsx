import type { ReactNode } from 'react'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted/80">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputClass =
  'w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-red'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-[96px] resize-y ${props.className ?? ''}`} />
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3"
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-red' : 'bg-line'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
      <span className="text-sm text-ink">{label}</span>
    </button>
  )
}

export function Btn({
  children,
  variant = 'primary',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'subtle' }) {
  const styles: Record<string, string> = {
    primary: 'bg-red text-white hover:bg-red-deep',
    ghost: 'border border-line text-charcoal hover:border-red hover:text-red',
    subtle: 'bg-offwhite text-charcoal hover:bg-line',
    danger: 'bg-ink text-white hover:bg-red-deep',
  }
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${
        rest.className ?? ''
      }`}
    >
      {children}
    </button>
  )
}

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-sm border border-line bg-ivory p-5">
      {title && <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-red">{title}</h3>}
      {children}
    </div>
  )
}
