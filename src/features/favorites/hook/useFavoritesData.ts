import { tmdb, fetchTmdb } from '@/config/tmdb'
import type { TmdbFavoriteItem } from '@/features/favorites/types'

export async function markFavorite(accountId: number, mediaType: 'movie' | 'tv', mediaId: number, favorite: boolean, sessionId: string): Promise<void> {
  await tmdb.post(`/account/${accountId}/favorite`, {
    media_type: mediaType, media_id: mediaId, favorite
  }, { params: { api_key: import.meta.env.VITE_TMDB_API_KEY, session_id: sessionId } })
}

export async function fetchFavoriteMovies(accountId: number, sessionId: string): Promise<TmdbFavoriteItem[]> {
  const data = await fetchTmdb<{ results: TmdbFavoriteItem[] }>(
    `/account/${accountId}/favorite/movies`,
    { session_id: sessionId, language: 'en-US', sort_by: 'created_at.desc' }
  )
  return data.results.map((r) => ({ ...r, media_type: 'movie' }))
}

export async function fetchFavoriteTv(accountId: number, sessionId: string): Promise<TmdbFavoriteItem[]> {
  const data = await fetchTmdb<{ results: TmdbFavoriteItem[] }>(
    `/account/${accountId}/favorite/tv`,
    { session_id: sessionId, language: 'en-US', sort_by: 'created_at.desc' }
  )
  return data.results.map((r) => ({ ...r, media_type: 'tv' }))
}
