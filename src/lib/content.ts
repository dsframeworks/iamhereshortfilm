/**
 * Content model + fallback defaults for the I'M HERE film website.
 *
 * All editable content lives in a single Supabase `content` row (JSONB).
 * Two rows exist: id = 'published' (live) and id = 'draft' (work-in-progress).
 * The public site reads 'published'. The admin edits 'draft' and promotes it
 * to 'published' on "Publish".
 *
 * IMPORTANT: Fallback content below is intentionally generic/placeholder.
 * No real cast names, crew, technical specs or external links are invented —
 * those fields are left blank or marked "To be announced" until a real admin
 * fills them in through the dashboard.
 */

export interface CastCrewEntry {
  id: string
  name: string
  role: string
  character?: string
  photoUrl?: string
  bio?: string
  socialUrl?: string
  category: 'cast' | 'crew'
}

export interface GalleryItem {
  id: string
  url: string
  caption?: string
  alt?: string
}

export interface SiteContent {
  // General
  filmTitle: string
  tagline: string
  synopsis: string
  genre: string
  language: string
  runtime: string
  releaseDate: string
  releaseMessage: string
  pageTitle: string
  seoDescription: string
  socialImageUrl: string

  // Hero & trailer
  trailerVideoUrl: string
  posterUrl: string
  posterFallbackUrl: string
  youtubeUrl: string
  trailerButtonText: string
  discoverButtonText: string
  filmButtonText: string // shown when the countdown reaches zero
  filmUrl: string // link to the full short film
  muteByDefault: boolean
  overlayOpacity: number // 0..1 (gradient readability overlay)
  heroBlur: number // px of glass blur over the trailer (0 = off)
  heroTint: number // 0..1 dark tint layer over the trailer

  // Countdown
  countdownTargetIso: string // ISO string including timezone offset
  countdownTimezoneLabel: string

  // Technical specifications
  tech: {
    runtime: string
    language: string
    resolution: string
    aspectRatio: string
    frameRate: string
    camera: string
    audioFormat: string
    cinematography: string
    editing: string
    colorGrading: string
    postProduction: string
  }

  // Credits & media
  castCrew: CastCrewEntry[]
  gallery: GalleryItem[]

  // Links
  instagramUrl: string
  imdbUrl: string

  copyright: string
}

export const DEFAULT_CONTENT: SiteContent = {
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
  socialImageUrl: '/media/poster.jpg',

  trailerVideoUrl: '/media/trailer.mp4',
  posterUrl: '/media/poster.jpg',
  posterFallbackUrl: '/media/poster.jpg',
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
    { id: 'g1', url: '/media/still-1.jpg', caption: 'A moment of stillness', alt: 'Pensive character in warm light' },
    { id: 'g2', url: '/media/still-2.jpg', caption: 'On set', alt: 'Behind the scenes with the camera crew' },
    { id: 'g3', url: '/media/still-3.jpg', caption: 'The red heart', alt: 'Red heart sculpture in an urban setting' },
    { id: 'g4', url: '/media/still-4.jpg', caption: 'The long road', alt: 'An empty road at dusk' },
  ],

  instagramUrl: '',
  imdbUrl: '',

  copyright: `© ${new Date().getFullYear()} I'M HERE. All rights reserved.`,
}

/** Deep-merge loaded content over defaults so missing keys always fall back. */
export function mergeContent(partial: Partial<SiteContent> | null | undefined): SiteContent {
  if (!partial) return DEFAULT_CONTENT
  return {
    ...DEFAULT_CONTENT,
    ...partial,
    tech: { ...DEFAULT_CONTENT.tech, ...(partial.tech ?? {}) },
    castCrew: partial.castCrew ?? DEFAULT_CONTENT.castCrew,
    gallery: partial.gallery && partial.gallery.length > 0 ? partial.gallery : DEFAULT_CONTENT.gallery,
  }
}
