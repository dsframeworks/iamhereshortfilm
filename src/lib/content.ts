import { SITE_CONTENT } from '../content/siteContent'

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
  trailerVideoUrl: string
  posterUrl: string
  posterFallbackUrl: string
  youtubeUrl: string
  trailerButtonText: string
  discoverButtonText: string
  filmButtonText: string
  filmUrl: string
  muteByDefault: boolean
  overlayOpacity: number
  heroBlur: number
  heroTint: number
  countdownTargetIso: string
  countdownTimezoneLabel: string
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
  castCrew: CastCrewEntry[]
  gallery: GalleryItem[]
  instagramUrl: string
  imdbUrl: string
  copyright: string
}

/** Static content is committed to GitHub and deployed with the site. */
export const DEFAULT_CONTENT: SiteContent = SITE_CONTENT

/** Merge partial configuration over defaults for safe configuration updates. */
export function mergeContent(partial: Partial<SiteContent> | null | undefined): SiteContent {
  if (!partial) return DEFAULT_CONTENT
  return {
    ...DEFAULT_CONTENT,
    ...partial,
    tech: { ...DEFAULT_CONTENT.tech, ...(partial.tech ?? {}) },
    castCrew: partial.castCrew ?? DEFAULT_CONTENT.castCrew,
    gallery: partial.gallery ?? DEFAULT_CONTENT.gallery,
  }
}
