import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from './content'

type Status = 'loading' | 'ready' | 'error'

/**
 * Loads PUBLISHED site content from Supabase (row id = 'published').
 * Falls back to DEFAULT_CONTENT when Supabase is not configured or on error,
 * so the public site always renders something sensible.
 *
 * Pass `which = 'draft'` for authenticated preview.
 */
export function useContent(which: 'published' | 'draft' = 'published') {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [status, setStatus] = useState<Status>(isSupabaseConfigured ? 'loading' : 'ready')

  useEffect(() => {
    let active = true
    if (!isSupabaseConfigured || !supabase) {
      setContent(DEFAULT_CONTENT)
      setStatus('ready')
      return
    }
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('data')
          .eq('id', which)
          .maybeSingle()
        if (!active) return
        if (error) throw error
        setContent(mergeContent((data?.data as Partial<SiteContent>) ?? null))
        setStatus('ready')
      } catch {
        if (!active) return
        setContent(DEFAULT_CONTENT)
        setStatus('error')
      }
    })()
    return () => {
      active = false
    }
  }, [which])

  return { content, status }
}
