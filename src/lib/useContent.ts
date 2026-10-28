import { DEFAULT_CONTENT } from './content'

/** Public content is bundled from the GitHub-managed siteContent file. */
export function useContent() {
  return { content: DEFAULT_CONTENT, status: 'ready' as const }
}
