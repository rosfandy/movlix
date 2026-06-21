import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchTmdb, mapMovie } from '@/config/tmdb'
import type { Movie } from '@/features/movies/types'

export function useCountryMovies(region: string) {
  const query = useInfiniteQuery({
    queryKey: ['country-movies', 'origin', region],
    queryFn: ({ pageParam = 1 }) =>
      fetchTmdb<{ results: any[]; total_pages: number; page: number }>('/discover/movie', {
        with_origin_country: region,
        sort_by: 'popularity.desc',
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  })

  const movies = (query.data?.pages ?? []).flatMap((p) => p.results.map(mapMovie)) as Movie[]

  return {
    movies,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  }
}
