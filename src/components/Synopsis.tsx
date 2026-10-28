import type { SiteContent } from '../lib/content'
import Section from './Section'

export default function Synopsis({ content }: { content: SiteContent }) {
  return (
    <Section id="synopsis" eyebrow="The Story">
      <p className="max-w-3xl text-2xl sm:text-3xl font-light leading-snug text-ink">
        {content.tagline}
      </p>
      <div className="mt-10 h-px w-16 bg-red" />
      <p className="mt-10 max-w-3xl text-lg leading-relaxed text-charcoal/90">{content.synopsis}</p>
    </Section>
  )
}
