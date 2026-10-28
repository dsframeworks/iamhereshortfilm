import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Play, RotateCcw, ArrowDown, Youtube } from 'lucide-react'
import type { SiteContent } from '../lib/content'
import Countdown from './Countdown'
import { useCountdown } from '../lib/useCountdown'

interface Props {
  content: SiteContent
}

/** Capitalize the first letter of each word, preserving apostrophes (I'M HERE -> I'm Here). */
function toTitleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^|\s)([a-z])/g, (_m, sep, ch) => sep + ch.toUpperCase())
}

export default function Hero({ content }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [muted, setMuted] = useState(content.muteByDefault)
  const [ended, setEnded] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const countdown = useCountdown(content.countdownTargetIso)

  useEffect(() => {
    setMuted(content.muteByDefault)
  }, [content.muteByDefault])

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted && v.paused) v.play().catch(() => {})
  }

  const replay = () => {
    const v = videoRef.current
    setEnded(false)
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
    }
  }

  const openYoutube = () => {
    if (content.youtubeUrl) window.open(content.youtubeUrl, '_blank', 'noopener,noreferrer')
  }

  const openFilm = () => {
    if (content.filmUrl) window.open(content.filmUrl, '_blank', 'noopener,noreferrer')
  }

  const showPoster = ended || videoFailed
  const poster = videoFailed ? content.posterFallbackUrl || content.posterUrl : content.posterUrl

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-ink" aria-label="Trailer and release countdown">
      {/* Background trailer */}
      {!videoFailed && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            showPoster ? 'opacity-0' : 'opacity-100'
          }`}
          src={content.trailerVideoUrl}
          poster={content.posterFallbackUrl || content.posterUrl}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          onEnded={() => setEnded(true)}
          onError={() => setVideoFailed(true)}
        />
      )}

      {/* Poster reveal when ended / failed */}
      <img
        src={poster}
        alt={`${content.filmTitle} official poster`}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          showPoster ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Glass blur + dark tint layer over the trailer (admin-adjustable).
          Disabled once the poster is revealed so the artwork stays crisp. */}
      {!showPoster && (content.heroBlur > 0 || content.heroTint > 0) && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: content.heroBlur > 0 ? `blur(${content.heroBlur}px)` : undefined,
            WebkitBackdropFilter: content.heroBlur > 0 ? `blur(${content.heroBlur}px)` : undefined,
            backgroundColor: `rgba(10,8,6,${content.heroTint})`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Readability gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(10,8,6,${content.overlayOpacity * 0.9}) 0%, rgba(10,8,6,${
            content.overlayOpacity * 0.35
          }) 40%, rgba(10,8,6,${content.overlayOpacity * 1.1}) 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 py-20 text-center sm:px-6 sm:py-24">
        <div className="fade-up">
          <p className="eyebrow text-red-soft">Official Short Film</p>
          <h1 className="mt-4 font-light text-white tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
            {toTitleCase(content.filmTitle)}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-lg text-white/85 font-light leading-relaxed">
            {content.tagline}
          </p>
        </div>

        <div className="mt-12 fade-up" style={{ animationDelay: '0.15s' }}>
          <Countdown
            targetIso={content.countdownTargetIso}
            timezoneLabel={content.countdownTimezoneLabel}
            releaseMessage={content.releaseMessage}
            light
          />
        </div>

        {countdown.done && (
          <div className="mt-8 fade-up">
            <button
              onClick={content.filmUrl ? openFilm : undefined}
              disabled={!content.filmUrl}
              className="inline-flex items-center gap-2.5 bg-red px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Youtube size={18} />
              {content.filmButtonText}
            </button>
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row fade-up" style={{ animationDelay: '0.3s' }}>
          {content.youtubeUrl ? (
            <button
              onClick={openYoutube}
              className="inline-flex items-center gap-2.5 bg-red px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-deep"
            >
              <Youtube size={18} />
              {content.trailerButtonText}
            </button>
          ) : (
            <a
              href="#poster"
              className="inline-flex items-center gap-2.5 bg-red px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-deep"
            >
              <Youtube size={18} />
              {content.trailerButtonText}
            </a>
          )}
          <a
            href="#synopsis"
            className="inline-flex items-center gap-2 border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {content.discoverButtonText}
          </a>
        </div>

        {showPoster && (
          <button
            onClick={replay}
            className="mt-8 inline-flex items-center gap-2 text-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline fade-up"
          >
            <RotateCcw size={15} /> Replay trailer
          </button>
        )}
      </div>

      {/* Mute / unmute */}
      {!showPoster && !videoFailed && (
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label={muted ? 'Unmute trailer' : 'Mute trailer'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span className="hidden sm:inline">{muted ? 'Unmute' : 'Mute'}</span>
        </button>
      )}

      {/* Replay affordance bottom-left when poster shown */}
      {showPoster && (
        <button
          onClick={replay}
          className="absolute bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Replay trailer"
        >
          <Play size={16} />
          <span className="hidden sm:inline">Play trailer</span>
        </button>
      )}

      {/* Scroll hint */}
      <a
        href="#synopsis"
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-white/60 transition-colors hover:text-white"
        aria-label="Scroll to content"
      >
        <ArrowDown size={22} className="animate-bounce" />
      </a>
    </section>
  )
}
