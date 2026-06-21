// ponytail: genre listing page, grid of cards from TMDB genres

import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useGenres } from '@/features/genres/hook/useGenres'

export function GenresPage() {
  const { genres, isLoading, error } = useGenres()

  useEffect(() => { document.title = 'Genres — movlix' }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-primary text-xl">Failed to load genres.</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="p-8 text-on-surface-variant">Loading...</div>
  }

  return (
    <main className="max-w-[1400px] mx-auto px-6 pt-24 pb-12">
      <h1 className="font-headline-lg text-headline-lg text-white mb-10">Genres</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to="/genres/$id"
            params={{ id: String(genre.id) }}
            className="group flex items-center justify-between p-6 bg-[#0a0a0a] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-300"
          >
            <span className="text-lg font-semibold text-gray-300 group-hover:text-white">{genre.name}</span>
            <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </Link>
        ))}
      </div>
    </main>
  )
}
