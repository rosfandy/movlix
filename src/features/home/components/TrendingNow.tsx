import { useState } from 'react'
import { ContentRow } from '@/components/fragment/ContentRow'
import { MovieCard } from '@/components/ui/MovieCard'
import { useTrendingMovies, type Movie } from '@/features/home/hook/useTrendingMovies'
import { Loading } from '@/components/ui/Loading'

export function TrendingNow() {
  const [activeFilter, setActiveFilter] = useState('all')
  const mediaType = activeFilter === 'series' ? 'tv' : 'movie'
  const { movies, isLoading, error } = useTrendingMovies(mediaType)

  if (error) return <div className="text-primary p-8">Failed to load movies</div>
  if (isLoading) return <Loading className="p-8" />

  return (
    <ContentRow
      title="Trending Now"
      filterTabs={[
        { label: 'All', value: 'all' },
        { label: 'Movies', value: 'movies' },
        { label: 'TV Series', value: 'series' },
      ]}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    >
      {movies.map((m: Movie) => (
        <MovieCard key={m.id} {...m} />
      ))}
    </ContentRow>
  )
}
