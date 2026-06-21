import { useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ContentRow } from '@/components/fragment/ContentRow'
import { CommentsSection } from '@/components/fragment/CommentsSection'
import { MovieCard } from '@/components/ui/MovieCard'
import { Loading } from '@/components/ui/Loading'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { mapMovie, fetchTmdb } from '@/config/tmdb'
import type { Movie } from '@/features/movies/types'
import { useMovieDetail } from '@/features/detail/hook/useMovieDetail'

export function MovieDetailPage() {
  const { slug } = useParams({ from: '/movies/$slug' })
  const [playingTrailer, setPlayingTrailer] = useState(false)
  const isNumericId = /^\d+$/.test(slug)

  // ponytail: pure slug requires a search-resolve step (extra API call)
  const search = useQuery({
    queryKey: ['slug-resolve', 'movie', slug],
    queryFn: () =>
      fetchTmdb<{ results: { id: number }[] }>('/search/movie', {
        query: slug.replace(/-/g, ' '),
      }),
    enabled: !isNumericId,
  })

  const movieId = isNumericId ? parseInt(slug, 10) : (search.data?.results?.[0]?.id ?? 0)
  const resolvingSlug = !isNumericId && (search.isLoading || !search.data)
  const notFound = !isNumericId && search.isFetched && !search.data?.results?.[0]

  const { detail, detailLoading, detailError, trailer, similar, reviews, cast } = useMovieDetail(movieId)

  useEffect(() => { document.title = detail ? `${detail.title} — movlix` : 'movlix' }, [detail])

  if (notFound || detailError) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-24">
        <p className="text-primary text-xl">Movie not found.</p>
      </div>
    )
  }
  if (resolvingSlug || detailLoading || !detail) {
    return <Loading fullPage />
  }

  const mapped = mapMovie(detail)
  const runtime = detail.runtime ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m` : undefined
  const genres = detail.genres?.map((g) => g.name).join(', ')

  return (
    <>
      {playingTrailer && trailer ? (
        /* Trailer section — video fills width, stop button above YouTube timeline */
        <section className="w-full bg-black pt-24 md:pt-24">
          <div className="aspect-video w-full max-h-[80vh] mx-auto relative">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title="Trailer"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
            <button
              onClick={() => setPlayingTrailer(false)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10  bg-primary/20 hover:bg-primary/40 text-white px-6 py-2 rounded-full font-headline-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">stop</span>
              Stop
            </button>
          </div>
        </section>
      ) : (
        /* Hero Section */
        <section className="relative w-full h-[500px] md:min-h-[700px] flex items-center sm:items-end pt-62 md:pt-32">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${mapped.backdrop}')` }}
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>
          <div className="relative z-10 px-4 md:px-margin-desktop pb-16 max-w-3xl">
            {runtime && (
              <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-primary-container text-on-primary-container font-label-caps text-[10px] md:text-label-caps mb-2 md:mb-4 rounded-sm">
                MOVIE
              </span>
            )}
            <h1 className="font-display-hero text-xl sm:text-display-hero-mobile md:text-display-hero mb-2 uppercase tracking-tight">{detail.title.toUpperCase()}</h1>
            {detail.release_date && (
              <p className="font-headline-sm text-xs md:text-headline-sm text-primary-container mb-3 md:mb-4">{detail.release_date.slice(0, 4)}</p>
            )}
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6 flex-wrap">
              <span className="glass-panel px-2 md:px-3 py-1 rounded text-xs md:text-body-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[12px]! md:text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                {mapped.rating}
              </span>
              {runtime && <span className="text-on-surface-variant font-label-caps text-[10px] md:text-label-caps">{runtime}</span>}
              {genres && <span className="text-on-surface-variant font-label-caps text-[10px] md:text-label-caps">• {genres}</span>}
            </div>
            
            <p className="font-body-sm md:font-body-lg text-xs md:text-body-lg text-on-surface-variant mb-6 md:mb-8 line-clamp-3">{detail.overview}</p>
            <div className="flex items-center gap-2 md:gap-4 mb-4">
              <button
                onClick={() => setPlayingTrailer(true)}
                disabled={!trailer}
                className="bg-primary-container hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 md:px-8 py-1.5 
                  md:py-3 rounded-xl font-headline-sm text-xs md:text-base flex items-center gap-1.5 md:gap-3 transition-transform 
                  active:scale-95 shadow-xl shadow-red-900/20"
              >
                <span className="material-symbols-outlined text-[16px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
                {trailer ? 'Watch Trailer' : 'No Trailer'}
              </button>
              <FavoriteButton mediaType="movie" mediaId={movieId} className="bg-white/10 hover:bg-white/20 text-white px-3 md:px-4 py-1.5 md:py-3 rounded-xl text-xs md:text-base" />
            </div>
            {cast.length > 0 && (
              <p className="text-[11px] md:text-body-sm text-on-surface mb-1.5 md:mb-2">
                <span className="text-on-surface-variant">Starring </span>{cast.join(', ')}
              </p>
            )}
          </div>
        </section>
      )}

      {/* More Like This */}
      <section className="px-4 md:px-margin-desktop py-row-gap bg-surface-container-lowest">
        <ContentRow title="More Like This" showViewAll={false}>
          {similar.map((m: Movie) => (
            <MovieCard key={m.id} {...m} />
          ))}
        </ContentRow>
      </section>

      {/* Comments Section */}
      <CommentsSection reviews={reviews} mediaType="movie" mediaId={movieId} />
    </>
  )
}
