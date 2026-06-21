// ponytail: reusable discover page — hero carousel + infinite scroll grid

import { useRef, useEffect } from 'react'
import { useDiscover } from '@/features/discover/hook/useDiscover'
import { HeroCarousel } from '@/components/fragment/HeroCarousel'
import { MovieCard } from '@/components/ui/MovieCard'
import type { Movie } from '@/features/movies/types'

interface DiscoverPageProps {
  mediaType: 'movie' | 'tv'
  title: string
  tag: string
}

const HERO_COUNT = 7

export function DiscoverPage({ mediaType, title, tag }: DiscoverPageProps) {
  const { items, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useDiscover(mediaType)

  useEffect(() => { document.title = `${title} — movlix` }, [title])

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasNextPage || isFetchingNextPage) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage()
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="p-8 text-on-surface-variant">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-primary text-xl">Failed to load.</p>
      </div>
    )
  }

  const heroItems = items.slice(0, HERO_COUNT).map((m: Movie) => ({
    id: m.id,
    backdrop: m.backdrop,
    title: m.title,
    overview: m.overview,
    year: m.year,
    rating: m.rating,
  }))

  return (
    <>
      <HeroCarousel items={heroItems} tag={tag} linkPrefix={mediaType === 'tv' ? '/series/' : '/movies/'} />
      <main className="max-w-[1400px] mx-auto px-6 pt-8 pb-12">
        <h1 className="font-headline-lg text-headline-lg text-white mb-10">{title}</h1>
        <div className="flex flex-wrap gap-2">
          {items.map((m: Movie) => (
            <MovieCard key={m.id} {...m} />
          ))}
          {isFetchingNextPage &&
            Array.from({ length: 6 }).map((_, i) => <MovieCard key={`skel-${i}`} skeleton />)}
        </div>
        {hasNextPage && <div ref={sentinelRef} className="h-4" />}
      </main>
    </>
  )
}
