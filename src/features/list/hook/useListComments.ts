// ponytail: list comments hook — fetches from shared TMDB list

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { tmdbV4, LIST_ID } from '@/config/tmdb'
import type { ListComment, CommentEntry, AddListItemsResponse } from '@/features/list/types'

export async function fetchListItems(listId: number, sessionId?: string): Promise<ListComment[]> {
  const headers: Record<string, string> = {}
  if (import.meta.env.VITE_TMDB_ACCESS_TOKEN) headers.Authorization = `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
  const params: Record<string, string> = {}
  if (sessionId) params.session_id = sessionId
  const { data } = await tmdbV4.get<{
    results: { id: number; media_type: string; title?: string; name?: string }[]
    comments: Record<string, string | null>
    created_by: { name: string; username: string }
  }>(`/list/${listId}`, { params, headers })

  return data.results.flatMap((item) => {
    const key = `${item.media_type}:${item.id}`
    const raw = data.comments[key]
    if (!raw) return []
    try {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) {
        return arr.map((e: CommentEntry) => ({
          author: e.name,
          comment: e.comment,
          created_at: new Date(e.time).toISOString(),
          media_type: item.media_type,
          media_id: item.id,
        }))
      }
    } catch { /* not JSON, legacy plain text */ }
    return [{
      author: data.created_by.name || data.created_by.username || 'Unknown',
      comment: raw,
      created_at: new Date().toISOString(),
      media_type: item.media_type,
      media_id: item.id,
    }]
  })
}

export async function appendListComment(
  listId: number,
  mediaType: string,
  mediaId: number,
  entry: CommentEntry,
  sessionId?: string,
): Promise<void> {
  const headers: Record<string, string> = {}
  if (import.meta.env.VITE_TMDB_ACCESS_TOKEN) headers.Authorization = `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
  const params: Record<string, string> = {}
  if (sessionId) params.session_id = sessionId

  const listData = await tmdbV4.get<{ comments: Record<string, string | null> }>(
    `/list/${listId}`, { params, headers }
  )

  const key = `${mediaType}:${mediaId}`
  const existing = listData.data.comments[key]
  let entries: CommentEntry[] = []
  if (existing) {
    try {
      const parsed = JSON.parse(existing)
      if (Array.isArray(parsed)) entries = parsed
    } catch { /* start fresh */ }
  }
  entries.push(entry)

  await tmdbV4.put(`/list/${listId}/items`, {
    items: [{ media_type: mediaType, media_id: mediaId, comment: JSON.stringify(entries) }]
  }, { params, headers })
}

export async function addListItems(listId: number, items: { media_type: string; media_id: number }[], sessionId?: string) {
  const headers: Record<string, string> = {}
  if (import.meta.env.VITE_TMDB_ACCESS_TOKEN) headers.Authorization = `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
  const params: Record<string, string> = {}
  if (sessionId) params.session_id = sessionId
  const { data } = await tmdbV4.post<AddListItemsResponse>(`/list/${listId}/items`, { items }, { params, headers })
  return data
}

export function useListComments(mediaType: 'movie' | 'tv', mediaId: number) {
  return useQuery<ListComment[]>({
    queryKey: ['list-comments', mediaType, mediaId],
    queryFn: async () => {
      try {
        const all = await fetchListItems(LIST_ID, localStorage.getItem('tmdb_session_id') ?? undefined)
        return all.filter((c) => c.media_type === mediaType && c.media_id === mediaId)
      } catch (err) {
        console.error('fetchListItems error:', err)
        return []
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
}

export function useInvalidateListComments(mediaType: 'movie' | 'tv', mediaId: number) {
  const qc = useQueryClient()
  return () => qc.refetchQueries({ queryKey: ['list-comments', mediaType, mediaId] })
}
