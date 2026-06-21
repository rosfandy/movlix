// ponytail: TV show detail page — hero, trailer, similar shows

import { useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ContentRow } from '@/components/fragment/ContentRow'
import { CommentsSection } from '@/components/fragment/CommentsSection'
import { MovieCard } from '@/components/ui/MovieCard'
import { useTvDetail } from '@/features/detail/hook/useTvDetail'
import { fetchTmdb } from '@/config/tmdb'
import type { Movie } from '@/features/movies/types'

export function TvDetailPage() {
  const { slug } = useParams({ from: '/series/$slug' })
  const [playingTrailer, setPlayingTrailer] = useState(false)
  const isNumericId = /^\d+$/.test(slug)

  // ponytail: pure slug requires a search-resolve step (extra API call)
  const search = useQuery({
    queryKey: ['slug-resolve', 'tv', slug],
    queryFn: () =>
      fetchTmdb<{ results: { id: number }[] }>('/search/tv', {
        query: slug.replace(/-/g, ' '),
      }),
    enabled: !isNumericId,
  })

  const showId = isNumericId ? parseInt(slug, 10) : (search.data?.results?.[0]?.id ?? 0)
  const resolvingSlug = !isNumericId && (search.isLoading || !search.data)
  const notFound = !isNumericId && search.isFetched && !search.data?.results?.[0]

  const { detail, detailLoading, detailError, trailer, similar, reviews, cast } = useTvDetail(showId)

  useEffect(() => { document.title = detail ? `${detail.name} — movlix` : 'movlix' }, [detail])

  if (notFound || detailError) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-24">
        <p className="text-primary text-xl">Show not found.</p>
      </div>
    )
  }
  if (resolvingSlug || detailLoading || !detail) {
    return <div className="pt-24 p-8 text-on-surface-variant text-center">Loading...</div>
  }

  const year = detail.first_air_date?.slice(0, 4)
  const genres = detail.genres?.map((g) => g.name).join(', ')
  const seasons = detail.number_of_seasons ? `${detail.number_of_seasons} Season${detail.number_of_seasons > 1 ? 's' : ''}` : undefined

  return (
    <>
      {playingTrailer && trailer ? (
        <section className="w-full bg-black pt-4 md:pt-24">
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
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 hover:bg-black/85 text-white px-6 py-2 rounded-full font-headline-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">stop</span>
              Stop
            </button>
          </div>
        </section>
      ) : (
        <section className="relative w-full min-h-dvh md:min-h-[600px] flex items-center sm:items-end pt-4 md:pt-24">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${detail.backdrop_path ? `https://image.tmdb.org/t/p/original${detail.backdrop_path}` : ''}')` }}
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>
          <div className="relative z-10 px-4 md:px-margin-desktop pb-16 max-w-3xl">
            <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-primary-container text-on-primary-container font-label-caps text-[10px] md:text-label-caps mb-2 md:mb-4 rounded-sm">
              TV SERIES
            </span>
            <h1 className="font-display-hero text-xl sm:text-display-hero-mobile md:text-display-hero mb-2 uppercase tracking-tight">{detail.name.toUpperCase()}</h1>
            {year && (
              <p className="font-headline-sm text-xs md:text-headline-sm text-primary-container mb-3 md:mb-4">{year}</p>
            )}
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6 flex-wrap">
              <span className="glass-panel px-2 md:px-3 py-1 rounded text-xs md:text-body-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[14px] md:text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                {Math.round(detail.vote_average * 10) / 10}
              </span>
              {seasons && <span className="text-on-surface-variant font-label-caps text-[10px] md:text-label-caps">{seasons}</span>}
              {genres && <span className="text-on-surface-variant font-label-caps text-[10px] md:text-label-caps">• {genres}</span>}
            </div>
            {cast.length > 0 && (
              <p className="text-[11px] md:text-body-sm text-on-surface mb-1.5 md:mb-2">
                <span className="text-on-surface-variant">Starring </span>{cast.join(', ')}
              </p>
            )}
            <p className="font-body-sm md:font-body-lg text-body-sm md:text-body-lg text-on-surface-variant mb-6 md:mb-8 line-clamp-3">{detail.overview}</p>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setPlayingTrailer(true)}
                disabled={!trailer}
                className="bg-primary-container hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 md:px-8 py-1.5 md:py-3 rounded-xl font-headline-sm text-xs md:text-base flex items-center gap-1.5 md:gap-3 transition-transform active:scale-95 shadow-xl shadow-red-900/20"
              >
                <span className="material-symbols-outlined text-[16px] md:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
                {trailer ? 'Watch Trailer' : 'No Trailer'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* More Like This */}
      <section className="px-margin-desktop py-row-gap bg-surface-container-lowest">
        <ContentRow title="More Like This" showViewAll={false}>
          {similar.map((s: Movie) => (
            <MovieCard key={s.id} {...s} />
          ))}
        </ContentRow>
      </section>

      {/* Comments Section */}
      <CommentsSection reviews={reviews} mediaType="tv" mediaId={showId} />
    </>
  )
}