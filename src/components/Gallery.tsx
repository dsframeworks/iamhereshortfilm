import { useEffect, useState } from 'react'
import type { SiteContent } from '../lib/content'
import Section from './Section'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function Gallery({ content }: { content: SiteContent }) {
  const [active, setActive] = useState<number | null>(null)
  const items = content.gallery

  useEffect(() => {
    if (active === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActive((current) => current === null ? null : (current - 1 + items.length) % items.length)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActive((current) => current === null ? null : (current + 1) % items.length)
      } else if (event.key === 'Escape') {
        setActive(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, items.length])

  if (items.length === 0) return null

  const showPrevious = () => setActive((current) => current === null ? null : (current - 1 + items.length) % items.length)
  const showNext = () => setActive((current) => current === null ? null : (current + 1) % items.length)

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
          <div className="flex w-full items-center justify-center gap-2 sm:gap-6" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white/90 transition hover:bg-white/20 hover:text-white sm:h-12 sm:w-12"
              onClick={showPrevious}
              aria-label="Previous still"
              title="Previous still"
            >
              <ChevronLeft size={26} />
            </button>
            <figure className="max-h-[90vh] min-w-0 max-w-5xl">
              <img
                src={items[active].url}
                alt={items[active].alt || ''}
                className="mx-auto max-h-[80vh] max-w-[calc(100vw-7rem)] w-auto rounded-sm object-contain sm:max-w-[72vw] lg:max-w-5xl"
              />
              {items[active].caption && (
                <figcaption className="mt-3 text-center text-sm text-white/80">{items[active].caption}</figcaption>
              )}
            </figure>
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white/90 transition hover:bg-white/20 hover:text-white sm:h-12 sm:w-12"
              onClick={showNext}
              aria-label="Next still"
              title="Next still"
            >
              <ChevronRight size={26} />
            </button>
          </div>
        </div>
      )}
    </Section>
  )
}
