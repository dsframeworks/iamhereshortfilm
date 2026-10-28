import { useEffect } from 'react'
import { useContent } from '../lib/useContent'
import Hero from '../components/Hero'
import Synopsis from '../components/Synopsis'
import FilmDetails from '../components/FilmDetails'
import TechSpecs from '../components/TechSpecs'
import CastCrew from '../components/CastCrew'
import Gallery from '../components/Gallery'
import PosterSection from '../components/PosterSection'
import Footer from '../components/Footer'

function useSeo(title: string, description: string, image: string) {
  useEffect(() => {
    document.title = title
    const set = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        const [, key] = selector.match(/\[(?:name|property)="(.+)"\]/) ?? []
        if (selector.includes('property')) el.setAttribute('property', key)
        else el.setAttribute('name', key)
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }
    set('meta[name="description"]', 'content', description)
    set('meta[property="og:title"]', 'content', title)
    set('meta[property="og:description"]', 'content', description)
    set('meta[property="og:image"]', 'content', image)
    set('meta[name="twitter:card"]', 'content', 'summary_large_image')
  }, [title, description, image])
}

export default function Home() {
  const { content } = useContent('published')
  useSeo(content.pageTitle, content.seoDescription, content.socialImageUrl)

  return (
    <main>
      <Hero content={content} />
      <Synopsis content={content} />
      <FilmDetails content={content} />
      <TechSpecs content={content} />
      <CastCrew content={content} />
      <Gallery content={content} />
      <PosterSection content={content} />
      <Footer content={content} />
    </main>
  )
}
