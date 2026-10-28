import { useState } from 'react'
import type { SiteContent } from '../lib/content'
import Section from './Section'
import { Youtube } from 'lucide-react'

export default function PosterSection({ content }: { content: SiteContent }) {
  const [loaded, setLoaded] = useState(false)
  const openYoutube = () => {
    if (content.youtubeUrl) window.open(content.youtubeUrl, '_blank', 'noopener,noreferrer')
  }
  return (
    <Section id="poster" eyebrow="Artwork" title="Official poster" alt>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-sm border border-line shadow-sm">
            <img
              src={content.posterUrl}
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = content.posterFallbackUrl || content.posterUrl
              }}
              alt={`${content.filmTitle} official poster`}
              className={`w-full transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        </div>
        <div>
          <h3 className="text-4xl font-light tracking-tight text-ink sm:text-5xl">{content.filmTitle}</h3>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-charcoal/85">{content.tagline}</p>
          <button
            onClick={content.youtubeUrl ? openYoutube : undefined}
            disabled={!content.youtubeUrl}
            className="mt-8 inline-flex items-center gap-2.5 bg-red px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Youtube size={18} />
            {content.trailerButtonText}
          </button>
          {!content.youtubeUrl && (
            <p className="mt-3 text-xs text-muted">Trailer link will be available soon.</p>
          )}
        </div>
      </div>
    </Section>
  )
}
