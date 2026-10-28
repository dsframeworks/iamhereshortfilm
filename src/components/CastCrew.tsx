import type { SiteContent, CastCrewEntry } from '../lib/content'
import Section from './Section'
import { ExternalLink, User } from 'lucide-react'

function Card({ e }: { e: CastCrewEntry }) {
  return (
    <div className="group">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-sm border border-line bg-offwhite">
        {e.photoUrl ? (
          <img
            src={e.photoUrl}
            alt={e.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <User size={40} strokeWidth={1} />
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{e.name}</h3>
      <p className="text-sm text-red">{e.role}</p>
      {e.character && <p className="text-sm text-muted">as {e.character}</p>}
      {e.bio && <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{e.bio}</p>}
      {e.socialUrl && (
        <a
          href={e.socialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-red"
        >
          Profile <ExternalLink size={12} />
        </a>
      )}
    </div>
  )
}

export default function CastCrew({ content }: { content: SiteContent }) {
  const cast = content.castCrew.filter((e) => e.category === 'cast')
  const crew = content.castCrew.filter((e) => e.category === 'crew')

  if (content.castCrew.length === 0) {
    return (
      <Section id="cast" eyebrow="The People" title="Cast & crew" alt>
        <p className="max-w-2xl text-lg text-muted">Full cast and crew credits will be announced soon.</p>
      </Section>
    )
  }

  return (
    <Section id="cast" eyebrow="The People" title="Cast & crew" alt>
      {cast.length > 0 && (
        <>
          <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-muted">Cast</h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {cast.map((e) => (
              <Card key={e.id} e={e} />
            ))}
          </div>
        </>
      )}
      {crew.length > 0 && (
        <>
          <h3 className="mb-6 mt-14 text-sm font-semibold uppercase tracking-[0.18em] text-muted">Crew</h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {crew.map((e) => (
              <Card key={e.id} e={e} />
            ))}
          </div>
        </>
      )}
    </Section>
  )
}
