import { useCountdown } from '../lib/useCountdown'

interface Props {
  targetIso: string
  timezoneLabel: string
  releaseMessage: string
  light?: boolean
}

function Unit({ value, label, light }: { value: number; label: string; light?: boolean }) {
  const padded = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <div
        className={`tabular-nums font-light leading-none tracking-tight ${
          light ? 'text-white' : 'text-ink'
        } text-4xl sm:text-5xl md:text-6xl`}
        aria-hidden="true"
      >
        {padded}
      </div>
      <div
        className={`mt-2 text-[0.6rem] sm:text-xs font-semibold uppercase tracking-[0.22em] ${
          light ? 'text-white/70' : 'text-muted'
        }`}
      >
        {label}
      </div>
    </div>
  )
}

export default function Countdown({ targetIso, timezoneLabel, releaseMessage, light }: Props) {
  const t = useCountdown(targetIso)

  if (t.done) {
    return (
      <div
        className={`inline-flex items-center gap-3 rounded-sm border px-6 py-4 ${
          light ? 'border-white/30 text-white' : 'border-line text-ink bg-paper/60'
        }`}
        role="status"
      >
        <span className="h-2 w-2 rounded-full bg-red animate-pulse" />
        <span className="text-base sm:text-lg font-semibold">{releaseMessage}</span>
      </div>
    )
  }

  const separator = (
    <span className={`text-3xl sm:text-4xl md:text-5xl font-extralight ${light ? 'text-white/40' : 'text-line'}`} aria-hidden="true">
      :
    </span>
  )

  return (
    <div
      className="inline-flex flex-col items-center gap-3"
      role="timer"
      aria-label={`${t.days} days, ${t.hours} hours, ${t.minutes} minutes and ${t.seconds} seconds until release`}
    >
      <div className="flex items-start gap-3 sm:gap-5">
        <Unit value={t.days} label="Days" light={light} />
        {separator}
        <Unit value={t.hours} label="Hours" light={light} />
        {separator}
        <Unit value={t.minutes} label="Minutes" light={light} />
        {separator}
        <Unit value={t.seconds} label="Seconds" light={light} />
      </div>
      <p className={`text-[0.65rem] uppercase tracking-[0.2em] ${light ? 'text-white/60' : 'text-muted'}`}>
        Premieres {timezoneLabel}
      </p>
    </div>
  )
}
