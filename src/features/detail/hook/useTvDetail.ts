// ponytail: TV show detail hook — detail, trailer, recommendations, reviews

import { useQuery } from '@tanstack/react-query'
import { fetchTmdb, mapTvShow } from '@/config/tmdb'
import type { Movie, TmdbVideo, TmdbReview } from '@/features/movies/types'
import type { TmdbTvShow, TmdbTvDetail } from '@/features/tv/types'

export async function fetchTvDetail(id: number) {
  return fetchTmdb<TmdbTvDetail>(`/tv/${id}`)
}
export async function fetchTvVideos(id: number) {
  const data = await fetchTmdb<{ results: TmdbVideo[] }>(`/tv/${id}/videos`)
  return data.results
}
export async function fetchTvRecommendations(id: number) {
  const data = await fetchTmdb<{ results: TmdbTvShow[] }>(`/tv/${id}/recommendations`)
  return data.results
}
export async function fetchTvReviews(id: number) {
  const data = await fetchTmdb<{ results: TmdbReview[] }>(`/tv/${id}/reviews`)
  return data.results
}
export async function fetchTvCredits(id: number) {
  const data = await fetchTmdb<{ cast: { id: number; name: string }[] }>(`/tv/${id}/credits`)
  return data.cast
}

export function useTvDetail(id: number) {
  const detail = useQuery({
    queryKey: ['tv-detail', id],
    queryFn: () => fetchTvDetail(id),
  })

  const videos = useQuery({
    queryKey: ['tv-videos', id],
    queryFn: () => fetchTvVideos(id),
  })

  const similar = useQuery({
    queryKey: ['tv-recommendations', id],
    queryFn: () => fetchTvRecommendations(id),
  })

  const reviews = useQuery({
    queryKey: ['tv-reviews', id],
    queryFn: () => fetchTvReviews(id),
  })

  const credits = useQuery({
    queryKey: ['tv-credits', id],
    queryFn: () => fetchTvCredits(id),
  })

  const trailer = (videos.data ?? []).find(
    (v: TmdbVideo) => v.type === 'Trailer' && v.site === 'YouTube'
  ) ?? null

  return {
    detail: detail.data ?? null,
    detailLoading: detail.isLoading,
    detailError: detail.error,
    trailer,
    similar: (similar.data ?? []).map(mapTvShow) as Movie[],
    reviews: reviews.data ?? [],
    cast: (credits.data ?? []).slice(0, 10).map((c) => c.name),
    isLoading: detail.isLoading || videos.isLoading,
    error: detail.error,
  }
}
