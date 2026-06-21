// ponytail: single hook consolidating detail, trailer, similar, and reviews

import { useQuery } from '@tanstack/react-query'
import { fetchTmdb, mapMovie } from '@/config/tmdb'
import type { Movie, TmdbVideo, TmdbMovie, TmdbReview } from '@/features/movies/types'

export async function fetchMovieDetail(id: number) {
  return fetchTmdb<TmdbMovie & { runtime?: number; genres?: { id: number; name: string }[] }>(`/movie/${id}`)
}
export async function fetchMovieVideos(id: number) {
  const data = await fetchTmdb<{ results: TmdbVideo[] }>(`/movie/${id}/videos`)
  return data.results
}
export async function fetchMovieRecommendations(id: number) {
  const data = await fetchTmdb<{ results: TmdbMovie[] }>(`/movie/${id}/recommendations`)
  return data.results
}
export async function fetchMovieReviews(id: number) {
  const data = await fetchTmdb<{ results: TmdbReview[] }>(`/movie/${id}/reviews`)
  return data.results
}
export async function fetchMovieCredits(id: number) {
  const data = await fetchTmdb<{ cast: { id: number; name: string }[] }>(`/movie/${id}/credits`)
  return data.cast
}

export function useMovieDetail(id: number) {
  const detail = useQuery({
    queryKey: ['movie-detail', id],
    queryFn: () => fetchMovieDetail(id),
  })

  const videos = useQuery({
    queryKey: ['movie-videos', id],
    queryFn: () => fetchMovieVideos(id),
  })

  const similar = useQuery({
    queryKey: ['movie-recommendations', id],
    queryFn: () => fetchMovieRecommendations(id),
  })

  const reviews = useQuery({
    queryKey: ['movie-reviews', id],
    queryFn: () => fetchMovieReviews(id),
  })

  const credits = useQuery({
    queryKey: ['movie-credits', id],
    queryFn: () => fetchMovieCredits(id),
  })

  const trailer = (videos.data ?? []).find(
    (v: TmdbVideo) => v.type === 'Trailer' && v.site === 'YouTube'
  ) ?? null

  return {
    detail: detail.data ?? null,
    detailLoading: detail.isLoading,
    detailError: detail.error,
    trailer,
    similar: (similar.data ?? []).map(mapMovie) as Movie[],
    similarLoading: similar.isLoading,
    reviews: reviews.data ?? [],
    cast: (credits.data ?? []).slice(0, 10).map((c) => c.name),
    isLoading: detail.isLoading || videos.isLoading,
    error: detail.error,
  }
}
