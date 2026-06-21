// ponytail: TMDB discover by genre with infinite scroll

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchTmdb, mapMovie } from '@/config/tmdb'
import type { TmdbMovie, Movie } from '@/features/movies/types'

export function useGenreMovies(genreId: number) {
  const query = useInfiniteQuery({
    queryKey: ['genre-movies', genreId],
    queryFn: ({ pageParam = 1 }) =>
      fetchTmdb<{ results: TmdbMovie[]; total_pages: number; page: number }>('/discover/movie', {
        with_genres: genreId,
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
