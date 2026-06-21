// ponytail: generic discover page with infinite scroll — works for movie & tv

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchTmdb, mapMovie, mapTvShow } from '@/config/tmdb'
import type { Movie } from '@/features/movies/types'

type MediaType = 'movie' | 'tv'

export function useDiscover(mediaType: MediaType) {
  const mapper = mediaType === 'tv' ? mapTvShow : mapMovie

  const query = useInfiniteQuery({
    queryKey: ['discover', mediaType],
    queryFn: ({ pageParam = 1 }) =>
      fetchTmdb<{ results: any[]; total_pages: number; page: number }>(
        `/discover/${mediaType}`,
        { sort_by: 'popularity.desc', page: pageParam },
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  })

  const items = (query.data?.pages ?? []).flatMap((p) => p.results.map(mapper)) as Movie[]

  return {
    items,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  }
}
