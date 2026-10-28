import type { SiteContent } from '../lib/content'
import Section from './Section'

export default function TechSpecs({ content }: { content: SiteContent }) {
  const t = content.tech
  const rows: { label: string; value: string }[] = [
    { label: 'Runtime', value: t.runtime },
    { label: 'Language', value: t.language },
    { label: 'Resolution', value: t.resolution },
    { label: 'Aspect Ratio', value: t.aspectRatio },
    { label: 'Frame Rate', value: t.frameRate },
    { label: 'Camera', value: t.camera },
    { label: 'Audio Format', value: t.audioFormat },
    { label: 'Cinematography', value: t.cinematography },
    { label: 'Editing', value: t.editing },
    { label: 'Color Grading', value: t.colorGrading },
    { label: 'Post-Production', value: t.postProduction },
  ]
  return (
    <Section id="technical" eyebrow="Craft" title="Technical specifications">
      <div className="divide-y divide-line border-y border-line">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
            <div className="w-48 shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {r.label}
            </div>
            <div className="text-base text-ink">{r.value}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}
