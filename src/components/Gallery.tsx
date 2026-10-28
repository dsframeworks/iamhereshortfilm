import { useState } from 'react'
import type { SiteContent } from '../lib/content'
import Section from './Section'
import { X } from 'lucide-react'

export default function Gallery({ content }: { content: SiteContent }) {
  const [active, setActive] = useState<number | null>(null)
  const items = content.gallery
  if (items.length === 0) return null

  return (
    <Section id="gallery" eyebrow="Imagery" title="Film stills & behind the scenes">
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((g, i) => (
          <button
            key={g.id}
            onClick={() => setActive(i)}
            className="block w-full overflow-hidden rounded-sm border border-line bg-offwhite focus-visible:outline-red"
          >
            <img
              src={g.url}
              alt={g.alt || g.caption || 'Film still'}
              loading="lazy"
              className="w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
            {g.caption && <span className="block px-3 py-2 text-left text-sm text-muted">{g.caption}</span>}
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute right-5 top-5 text-white/80 hover:text-white"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <figure className="max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={items[active].url} alt={items[active].alt || ''} className="max-h-[80vh] w-auto rounded-sm" />
            {items[active].caption && (
              <figcaption className="mt-3 text-center text-sm text-white/80">{items[active].caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </Section>
  )
}
