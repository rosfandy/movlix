import { useQuery } from '@tanstack/react-query'
import { fetchTmdb } from '@/config/tmdb'

export interface Country {
  iso_3166_1: string
  english_name: string
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => fetchTmdb<Country[]>('/configuration/countries'),
    staleTime: 86_400_000,
  })
}
