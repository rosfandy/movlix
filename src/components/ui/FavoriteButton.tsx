import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchTmdbAccount } from '@/features/auth/hook/useTmdbAuth'
import { markFavorite } from '@/features/favorites/hook/useFavoritesData'
import { useFavorites } from '@/features/favorites/hook/useFavorites'

interface FavoriteButtonProps {
  mediaType: 'movie' | 'tv'
  mediaId: number
  className?: string
}

export function FavoriteButton({ mediaType, mediaId, className = '' }: FavoriteButtonProps) {
  const qc = useQueryClient()
  const { data: favorites = [] } = useFavorites()
  const faved = favorites.some((f) => f.id === mediaId && f.media_type === mediaType)

  const toggle = useCallback(async () => {
    const sid = localStorage.getItem('tmdb_session_id')
    if (!sid) return
    let aid = localStorage.getItem('tmdb_account_id')
    if (!aid) {
      try {
        const acc = await fetchTmdbAccount(sid)
        aid = String(acc.id)
        localStorage.setItem('tmdb_account_id', aid)
      } catch { return }
    }
    const next = !faved
    qc.setQueryData(['favorites'], (old: any[]) => {
      if (!old) return old
      return next
        ? [...old, { id: mediaId, media_type: mediaType }]
        : old.filter((f: any) => !(f.id === mediaId && f.media_type === mediaType))
    })
    try {
      await markFavorite(Number(aid), mediaType, mediaId, next, sid)
      toast.success(next ? 'Added to favorites' : 'Removed from favorites', { icon: '❤️' })
    } catch {
      qc.invalidateQueries({ queryKey: ['favorites'] })
      toast.error('Failed to update favorite', { icon: '❤️' })
    }
  }, [mediaType, mediaId, faved, qc])

  return (
    <button
      onClick={toggle}
      className={`flex items-center justify-center transition-all active:scale-95 ${className}`}
    >
      <span
        className="material-symbols-outlined text-red-400"
        style={{ fontVariationSettings: faved ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  )
}
