import { useQuery } from '@tanstack/react-query'
import { fetchFavoriteMovies, fetchFavoriteTv } from './useFavoritesData'
import { fetchTmdbAccount } from '@/features/auth/hook/useTmdbAuth'

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const sid = localStorage.getItem('tmdb_session_id')
      if (!sid) return []
      let aid = localStorage.getItem('tmdb_account_id')
      if (!aid) {
        const acc = await fetchTmdbAccount(sid)
        aid = String(acc.id)
        localStorage.setItem('tmdb_account_id', aid)
      }
      const [movies, tv] = await Promise.all([
        fetchFavoriteMovies(Number(aid), sid),
        fetchFavoriteTv(Number(aid), sid),
      ])
      return [...movies, ...tv]
    },
    staleTime: 0,
  })
}
