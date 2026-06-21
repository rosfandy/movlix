import { useState, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useSearch } from '@/features/search/hook/useSearch'
import { TMDB_IMAGE_BASE, slugify } from '@/config/tmdb'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { data: results = [], isLoading } = useSearch(query)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const cb = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', cb)
    return () => document.removeEventListener('keydown', cb)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center pt-[15vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
      <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 glass-panel rounded-xl px-4 py-3 mb-6">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies & TV series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-body-lg placeholder:text-on-surface-variant/50 w-full outline-none text-on-surface"
          />
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
          </div>
        )}

        {!isLoading && query.length >= 2 && results.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <span className="material-symbols-outlined text-5xl mb-3">search_off</span>
            <p className="font-headline-sm">No results for "{query}"</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="max-h-[65vh] overflow-y-auto space-y-2">
            {results.map((r) => (
              <Link
                key={`${r.media_type}-${r.id}`}
                to={r.media_type === 'movie' ? `/movies/${slugify(r.title)}` : `/series/${slugify(r.name)}`}
                onClick={onClose}
                className="flex items-center gap-4 glass-panel rounded-xl p-3 hover:bg-white/5 transition-colors"
              >
                <div className="w-auto h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high">
                  {r.poster_path && (
                    <img src={`${TMDB_IMAGE_BASE}/w92${r.poster_path}`} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-headline-sm text-headline-sm text-white truncate">{r.title ?? r.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest bg-primary-container text-white">{r.media_type === 'movie' ? 'MOVIE' : 'TV'}</span>
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[12px] font-bold">{Math.round(r.vote_average * 10) / 10}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
