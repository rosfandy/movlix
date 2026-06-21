import { useQuery } from '@tanstack/react-query'
import { fetchTmdb, mapMovie, mapTvShow } from '@/config/tmdb'
import type { Movie } from '@/features/movies/types'

type MediaType = 'movie' | 'tv'

export function useTrendingMovies(mediaType: MediaType = 'movie', limit = 10) {
  const mapper = mediaType === 'tv' ? mapTvShow : mapMovie
  const { data: movies = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['trending-movies', mediaType, limit],
    queryFn: async () => {
      const data = await fetchTmdb<{ results: any[] }>(`/trending/${mediaType}/day`, { limit })
      return data.results
    },
  })

  const [featured, ...rest] = movies
  const featuredMapped = featured ? mapper(featured) : null
  const restMapped = rest.map(mapper)

  return {
    featured: featuredMapped,
    movies: restMapped,
    isLoading,
    error,
  }
}

export type { Movie }
