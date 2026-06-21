import { useEffect } from 'react'
import { HeroCarousel } from '@/components/fragment/HeroCarousel'
import { TrendingNow } from '@/features/home/components/TrendingNow'
import { useTrendingMovies, type Movie } from '@/features/home/hook/useTrendingMovies'

export function HomePage() {
  const { movies: heroMovies, isLoading, error } = useTrendingMovies('movie')

  useEffect(() => { document.title = 'Home — movlix' }, [])

  if (error) {
    console.log('[HomePage] TMDB error:', error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <p className="text-primary font-bold text-xl mb-2">Failed to load movies</p>
          <p className="text-on-surface-variant text-sm">{error.message}</p>
        </div>
      </div>
    )
  }
  if (isLoading) return <div className="p-8 text-on-surface-variant">Loading...</div>

  const carouselItems = heroMovies.map((m: Movie) => ({
    id: m.id,
    backdrop: m.backdrop,
    title: m.title,
    overview: m.overview,
    year: m.year,
    rating: m.rating,
  }))

  return (
    <>
      <HeroCarousel items={carouselItems} />

      <div className="space-y-row-gap py-12 px-4 md:px-margin-desktop">
        <TrendingNow />
      </div>
    </>
  )
}
