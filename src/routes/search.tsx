import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useSearch } from '@/features/search/hook/useSearch'
import { TMDB_IMAGE_BASE, slugify } from '@/config/tmdb'

export const Route = createFileRoute('/search')({
  component: SearchPage,
})

function SearchPage() {
  const [query, setQuery] = useState('')
  const { data: results = [], isLoading } = useSearch(query)

  return (
    <div className="pt-24 px-margin-mobile md:px-margin-desktop pb-row-gap">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-3 bg-surface-container-high border border-outline-variant/20 rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search movies & TV series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-body-lg placeholder:text-on-surface-variant/50 w-full outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        </div>
      )}

      {!isLoading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
          <p className="font-headline-sm">No results for "{query}"</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-card-gap">
          {results.map((r) => (
            <Link
              key={`${r.media_type}-${r.id}`}
              to={r.media_type === 'movie' ? `/movies/${slugify(r.title)}` : `/series/${slugify(r.name)}`}
              className="group relative aspect-[2/3] rounded-xl overflow-hidden glass-panel hover:scale-105 transition-all duration-500"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${r.poster_path ? `${TMDB_IMAGE_BASE}/w500${r.poster_path}` : ''}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-primary-container text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                    {r.media_type === 'movie' ? 'MOVIE' : 'TV'}
                  </span>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-[12px] font-bold">{Math.round(r.vote_average * 10) / 10}</span>
                  </div>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-white line-clamp-1">{r.title ?? r.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {query.length < 2 && (
        <div className="text-center py-20 opacity-40">
          <span className="material-symbols-outlined text-6xl mb-4">search</span>
          <p className="font-headline-sm">Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  )
}
