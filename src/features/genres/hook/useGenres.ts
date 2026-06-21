// ponytail: TMDB genre list hook

import { useQuery } from '@tanstack/react-query'
import { fetchTmdb } from '@/config/tmdb'

export interface Genre {
  id: number
  name: string
}

export function useGenres() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['genres'],
    queryFn: () => fetchTmdb<{ genres: Genre[] }>('/genre/movie/list'),
  })

  return { genres: data?.genres ?? [], isLoading, error }
}
