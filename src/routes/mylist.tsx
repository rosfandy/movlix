import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useTmdbAuth } from '@/features/auth/hook/useTmdbAuth'
import { markFavorite } from '@/features/favorites/hook/useFavoritesData'
import { TMDB_IMAGE_BASE, slugify } from '@/config/tmdb'
import { useFavorites } from '@/features/favorites/hook/useFavorites'

export const Route = createFileRoute('/mylist')({
  component: MyListPage,
})

function MyListPage() {
  const { isLoggedIn, login } = useTmdbAuth()
  const qc = useQueryClient()
  const { data: favorites = [] } = useFavorites()
  const movies = favorites.filter((f) => f.media_type === 'movie')
  const tvShows = favorites.filter((f) => f.media_type === 'tv')

  const unfav = async (mediaId: number, mediaType: 'movie' | 'tv') => {
    const sid = localStorage.getItem('tmdb_session_id')
    const aid = localStorage.getItem('tmdb_account_id')
    if (!sid || !aid) return
    await markFavorite(Number(aid), mediaType, mediaId, false, sid)
    qc.invalidateQueries({ queryKey: ['favorites'] })
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">favorite</span>
        <p className="font-headline-sm text-headline-sm">Sign in to view your favorites</p>
        <button onClick={login} className="px-6 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm">Sign in</button>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">favorite</span>
        <p className="font-headline-sm text-headline-sm">No favorites yet</p>
        <p className="text-on-surface-variant">Tap the heart on any movie to add it here.</p>
      </div>
    )
  }

  return (
    <div className="pt-32 min-h-screen px-margin-mobile md:px-margin-desktop pb-row-gap">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg md:text-display-hero text-white tracking-tight">Your Favorites</h2>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
            <span className="text-primary font-bold">{favorites.length}</span> movies saved
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <select className="appearance-none bg-surface-container-low border border-white/10 text-on-surface font-body-sm text-body-sm px-6 py-3 pr-12 rounded-lg cursor-pointer hover:border-primary transition-all focus:ring-2 focus:ring-primary/20 w-full md:w-48">
              <option>Date Added</option>
              <option>Rating</option>
              <option>A-Z</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
          </div>
        </div>
      </section>

      {movies.length > 0 && (
        <section className="mb-12">
          <h3 className="font-headline-md text-headline-md mb-6">Movies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-card-gap">
            {movies.map((m) => (
              <Link key={`movie-${m.id}`} to={`/movies/${slugify(m.title)}`} className="group relative aspect-[2/3] rounded-xl overflow-hidden glass-panel cinematic-shadow hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${TMDB_IMAGE_BASE}/w500${m.poster_path}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={(e) => { e.preventDefault(); unfav(m.id, 'movie') }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-primary-container transition-all"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[12px] font-bold">{Math.round(m.vote_average * 10) / 10}</span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-white line-clamp-1">{m.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {tvShows.length > 0 && (
        <section>
          <h3 className="font-headline-md text-headline-md mb-6">TV Shows</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-card-gap">
            {tvShows.map((m) => (
              <Link key={`tv-${m.id}`} to={`/series/${slugify(m.name)}`} className="group relative aspect-[2/3] rounded-xl overflow-hidden glass-panel cinematic-shadow hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${TMDB_IMAGE_BASE}/w500${m.poster_path}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={(e) => { e.preventDefault(); unfav(m.id, 'tv') }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-primary-container transition-all"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[12px] font-bold">{Math.round(m.vote_average * 10) / 10}</span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-white line-clamp-1">{m.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
