import { useQuery } from '@tanstack/react-query'
import { fetchTmdb } from '@/config/tmdb'

export interface SearchResult {
  id: number
  media_type: 'movie' | 'tv'
  title?: string
  name?: string
  poster_path: string | null
  vote_average: number
  release_date?: string
  first_air_date?: string
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const data = await fetchTmdb<{ results: SearchResult[] }>('/search/multi', { query, language: 'en-US', page: 1 })
      return data.results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
    },
    enabled: query.trim().length >= 2,
    staleTime: 60_000,
  })
}
