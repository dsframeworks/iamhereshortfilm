import type { SiteContent } from '../lib/content'
import { mediaUrl } from '../lib/media'

/**
 * GitHub-managed public site content.
 * Edit this file and commit to main; GitHub Actions rebuilds and deploys Pages.
 * Keep media paths relative to public/media and use mediaUrl for Pages URLs.
 */
export const SITE_CONTENT: SiteContent = {
  filmTitle: "I'M HERE",
  tagline: 'Sometimes the loudest thing you can say is simply: I am here.',
  synopsis:
    "I'M HERE is a short film about presence — about the quiet, aching need to be seen and to matter to someone. Told through intimate, unhurried images, it follows a single soul searching for connection in an indifferent world, and the small, luminous moment in which that connection is finally found.",
  genre: 'Drama · Short Film',
  language: 'To be announced',
  runtime: 'To be announced',
  releaseDate: '19 November 2026',
  releaseMessage: "I'M HERE is now streaming.",
  pageTitle: "I'M HERE — Official Short Film",
  seoDescription:
    "The official website of I'M HERE, a short film about presence, longing and being seen. Watch the trailer and count down to the premiere.",
  socialImageUrl: mediaUrl('poster.jpg'),

  trailerVideoUrl: mediaUrl('trailer/Trailer.mp4'),
  posterUrl: mediaUrl('poster.jpg'),
  posterFallbackUrl: mediaUrl('poster.jpg'),
  youtubeUrl: '',
  trailerButtonText: 'Watch trailer on YouTube',
  discoverButtonText: 'Discover the film',
  filmButtonText: 'Watch Short Film on YouTube',
  filmUrl: '',
  muteByDefault: true,
  overlayOpacity: 0.28,
  heroBlur: 3,
  heroTint: 0.46,

  countdownTargetIso: '2026-11-19T12:00:00+05:30',
  countdownTimezoneLabel: 'IST (India Standard Time)',

  tech: {
    runtime: 'To be announced',
    language: 'To be announced',
    resolution: 'To be announced',
    aspectRatio: 'To be announced',
    frameRate: 'To be announced',
    camera: 'To be announced',
    audioFormat: 'To be announced',
    cinematography: 'To be announced',
    editing: 'To be announced',
    colorGrading: 'To be announced',
    postProduction: 'To be announced',
  },

  castCrew: [],
  gallery: [
    'Screenshot 2026-10-28 110413.png',
    'Screenshot 2026-10-28 110437.png',
    'Screenshot 2026-10-28 110451.png',
    'Screenshot 2026-10-28 110511.png',
    'Screenshot 2026-10-28 110524.png',
    'Screenshot 2026-10-28 110603.png',
    'Screenshot 2026-10-28 110634.png',
    'Screenshot 2026-10-28 110645.png',
    'Screenshot 2026-10-28 110715.png',
    'Screenshot 2026-10-28 110728.png',
    'Screenshot 2026-10-28 110912.png',
  ].map((filename, index) => ({
    id: `still-${index + 1}`,
    url: mediaUrl(`stills/${filename}`),
    alt: `I'M HERE promotional still ${index + 1}`,
  })),

  instagramUrl: '',
  imdbUrl: '',
  copyright: `© ${new Date().getFullYear()} I'M HERE. All rights reserved.`,
}
