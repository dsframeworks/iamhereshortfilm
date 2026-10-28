/** Build a public asset URL that respects Vite's configured deployment base. */
export function mediaUrl(relativePath: string): string {
  const encodedPath = relativePath.split('/').map(encodeURIComponent).join('/')
  return `${import.meta.env.BASE_URL}media/${encodedPath}`
}
