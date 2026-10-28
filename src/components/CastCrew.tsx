import { useState } from 'react'
import { Instagram, Sparkles, UserRound } from 'lucide-react'
import type { FilmCredit } from '../data/filmCredits'
import { filmCredits } from '../data/filmCredits'
import Section from './Section'

function instagramProfileUrl(value: string): string | null {
  if (!value.trim()) return null
  try {
    const url = new URL(value)
    const parts = url.pathname.split('/').filter(Boolean)
    const reservedPaths = new Set(['about', 'accounts', 'direct', 'explore', 'p', 'reel', 'reels', 'stories'])
    if (
      url.protocol !== 'https:' ||
      !['instagram.com', 'www.instagram.com'].includes(url.hostname.toLowerCase()) ||
      url.username ||
      url.password ||
      parts.length !== 1 ||
      !/^[A-Za-z0-9._]+$/.test(parts[0]) ||
      reservedPaths.has(parts[0].toLowerCase())
    ) return null
    return url.href
  } catch {
    return null
  }
}

function CreditCard({ credit }: { credit: FilmCredit }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = credit.imageUrl.trim()
  const profileUrl = instagramProfileUrl(credit.instagramUrl)
  const isAiGeneratedCast = credit.type === 'Cast' && credit.aiGenerated === true
  const displayName = credit.name

  return (
    <article className="group">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-sm border border-line bg-offwhite">
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={displayName || 'Credit portrait'}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-paper to-offwhite text-muted" aria-hidden="true">
            {isAiGeneratedCast ? <Sparkles size={42} strokeWidth={1} /> : <UserRound size={42} strokeWidth={1} />}
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{displayName}</h3>
      {credit.type === 'Cast' ? (
        <p className={`text-sm ${isAiGeneratedCast ? 'text-red' : 'text-muted'}`}>as {credit.character}</p>
      ) : (
        <p className="text-sm text-red">{credit.role}</p>
      )}
      {credit.instagramId.trim() && (
        profileUrl ? (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-red"
            aria-label={`Instagram ${credit.instagramId}`}
          >
            <Instagram size={13} /> {credit.instagramId}
          </a>
        ) : (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
            <Instagram size={13} /> {credit.instagramId}
          </p>
        )
      )}
    </article>
  )
}

function CreditGrid({ entries }: { entries: FilmCredit[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {entries.map((credit, index) => (
        <CreditCard key={`${credit.type}-${credit.name}-${index}`} credit={credit} />
      ))}
    </div>
  )
}

export default function CastCrew() {
  const cast = filmCredits.filter((credit) => credit.type === 'Cast')
  const crew = filmCredits.filter((credit) => credit.type === 'Crew')

  return (
    <>
      {cast.length > 0 && (
        <Section id="cast" eyebrow="The People" title="Cast">
          <CreditGrid entries={cast} />
        </Section>
      )}
      {crew.length > 0 && (
        <Section id="crew" eyebrow="Behind the film" title="Crew" alt>
          <CreditGrid entries={crew} />
        </Section>
      )}
    </>
  )
}
