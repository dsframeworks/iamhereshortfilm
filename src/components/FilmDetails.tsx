import type { SiteContent } from '../lib/content'
import Section from './Section'

export default function FilmDetails({ content }: { content: SiteContent }) {
  const rows = [
    { label: 'Genre', value: content.genre },
    { label: 'Language', value: content.language },
    { label: 'Runtime', value: content.runtime },
    { label: 'Release Date', value: content.releaseDate },
  ]
  return (
    <Section id="details" eyebrow="The Film" title="Film details" alt>
      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="bg-ivory px-6 py-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-red">{r.label}</dt>
            <dd className="mt-2 text-lg text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
