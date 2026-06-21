// ponytail: country movie listing page with hero carousel + infinite scroll

import { useParams } from '@tanstack/react-router'
import { useRef, useEffect } from 'react'
import { useCountryMovies } from '@/features/countries/hook/useCountryMovies'
import { useCountries } from '@/features/countries/hook/useCountries'
import { HeroCarousel } from '@/components/fragment/HeroCarousel'
import { MovieCard } from '@/components/ui/MovieCard'
import { Loading } from '@/components/ui/Loading'
import type { Movie } from '@/features/movies/types'

const HERO_COUNT = 7

export function CountryMoviesPage() {
  const { id } = useParams({ from: '/country/$id' })
  const region = id.toUpperCase()

  const { data: countries = [] } = useCountries()
  const country = countries.find((c) => c.iso_3166_1 === region)
  const countryName = country?.english_name ?? region

  const { movies, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useCountryMovies(region)

  useEffect(() => { document.title = `${countryName} Movies — movlix` }, [countryName])

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasNextPage || isFetchingNextPage) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fetchNextPage() },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return <Loading className="min-h-[60vh]" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-primary text-xl">Failed to load movies.</p>
      </div>
    )
  }

  const heroItems = movies.slice(0, HERO_COUNT).map((m: Movie) => ({
    id: m.id, backdrop: m.backdrop, title: m.title, overview: m.overview, year: m.year, rating: m.rating,
  }))

  return (
    <>
      <HeroCarousel items={heroItems} tag={countryName} />
      <main className="max-w-[1400px] mx-auto px-4 md:px-6 pb-12">
        <h1 className="font-headline-sm md:font-headline-lg text-headline-sm md:text-headline-lg text-white mb-6 md:mb-10">{countryName} Movies</h1>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2 md:gap-3">
          {movies.map((m: Movie) => (
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
