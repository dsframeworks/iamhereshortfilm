import { supabase, MEDIA_BUCKET } from './supabase'
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from './content'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB
const MAX_VIDEO_BYTES = 200 * 1024 * 1024 // 200 MB
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

/** Returns the current user id if the signed-in user is an authorized admin. */
export async function getAdminUser() {
  if (!supabase) return null
  const { data: sessionData } = await supabase.auth.getUser()
  const user = sessionData.user
  if (!user) return null
  // Server-side authorization check: the `admins` table is protected by RLS so
  // a row is only visible to its owner. If a row exists, the user is an admin.
  const { data, error } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
  if (error || !data) return null
  return user
}

export async function loadContentRow(which: 'published' | 'draft'): Promise<SiteContent> {
  if (!supabase) return DEFAULT_CONTENT
  const { data } = await supabase.from('content').select('data').eq('id', which).maybeSingle()
  return mergeContent((data?.data as Partial<SiteContent>) ?? null)
}

/** Recursively strip angle brackets from every string field. URLs kept intact. */
function sanitizeContent<T>(value: T): T {
  if (typeof value === 'string') return value.replace(/[<>]/g, '').slice(0, 20000) as unknown as T
  if (Array.isArray(value)) return value.map((v) => sanitizeContent(v)) as unknown as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = sanitizeContent(v)
    return out as T
  }
  return value
}

/** Save the working content to the draft row. */
export async function saveDraft(content: SiteContent) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const clean = sanitizeContent(content)
  const { error } = await supabase
    .from('content')
    .upsert({ id: 'draft', data: clean, updated_at: new Date().toISOString() })
  if (error) throw error
}

/** Promote the current draft to the published row. */
export async function publishDraft(content: SiteContent) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const clean = sanitizeContent(content)
  const now = new Date().toISOString()
  const { error } = await supabase.from('content').upsert([
    { id: 'draft', data: clean, updated_at: now },
    { id: 'published', data: clean, updated_at: now },
  ])
  if (error) throw error
}

export interface UploadResult {
  url: string
  path: string
}

/** Validate + upload a file to Supabase Storage, returning a public URL. */
export async function uploadMedia(
  file: File,
  kind: 'image' | 'video',
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const allowed = kind === 'image' ? IMAGE_TYPES : VIDEO_TYPES
  const maxBytes = kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES
  if (!allowed.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || 'unknown'}. Allowed: ${allowed.join(', ')}`)
  }
  if (file.size > maxBytes) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max ${maxBytes / 1024 / 1024} MB.`)
  }
  onProgress?.(10)
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || (kind === 'image' ? 'jpg' : 'mp4')
  const path = `${kind}s/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error
  onProgress?.(90)
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  onProgress?.(100)
  return { url: data.publicUrl, path }
}

/** List media items currently stored in the bucket (images/ and videos/). */
export async function listMedia(): Promise<{ name: string; url: string; path: string; folder: string }[]> {
  if (!supabase) return []
  const folders = ['images', 'videos']
  const out: { name: string; url: string; path: string; folder: string }[] = []
  for (const folder of folders) {
    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if (error || !data) continue
    for (const f of data) {
      if (f.name === '.emptyFolderPlaceholder') continue
      const path = `${folder}/${f.name}`
      const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
      out.push({ name: f.name, url: pub.publicUrl, path, folder })
    }
  }
  return out
}

export async function deleteMedia(path: string) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path])
  if (error) throw error
}

/** Basic text sanitizer: strips angle brackets to prevent HTML injection. */
export function sanitizeText(input: string): string {
  return input.replace(/[<>]/g, '').slice(0, 5000)
}
