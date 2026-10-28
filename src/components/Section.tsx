import type { ReactNode } from 'react'

interface Props {
  id?: string
  eyebrow?: string
  title?: string
  children: ReactNode
  className?: string
  alt?: boolean
}

export default function Section({ id, eyebrow, title, children, className = '', alt }: Props) {
  return (
    <section
      id={id}
      className={`px-6 py-20 sm:py-28 ${alt ? 'bg-offwhite' : 'bg-ivory'} ${className}`}
    >
      <div className="mx-auto max-w-5xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && (
          <h2 className="mt-3 mb-10 text-3xl sm:text-4xl font-light tracking-tight text-ink">{title}</h2>
        )}
        {children}
      </div>
    </section>
  )
}
