import type { SiteContent } from '../lib/content'
import { Instagram, Film } from 'lucide-react'

export default function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="border-t border-line bg-ivory px-6 py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <div className="text-3xl font-light tracking-tight text-ink">{content.filmTitle}</div>
        <div className="flex items-center gap-4">
          {content.instagramUrl && (
            <a
              href={content.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-line px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:border-red hover:text-red"
            >
              <Instagram size={16} /> Instagram
            </a>
          )}
          {content.imdbUrl && (
            <a
              href={content.imdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-line px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:border-red hover:text-red"
            >
              <Film size={16} /> IMDb
            </a>
          )}
        </div>
        <p className="text-sm text-muted">{content.copyright}</p>
      </div>
    </footer>
  )
}
