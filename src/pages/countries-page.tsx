// ponytail: country listing page, searchable list

import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useCountries } from '@/features/countries/hook/useCountries'
import { Loading } from '@/components/ui/Loading'

export function CountriesPage() {
  const { data: countries = [], isLoading, error } = useCountries()
  const [query, setQuery] = useState('')

  useEffect(() => { document.title = 'Countries — movlix' }, [])

  const sorted = useMemo(
    () => [...countries].sort((a, b) => a.english_name.localeCompare(b.english_name)),
    [countries],
  )
  const filtered = query.trim()
    ? sorted.filter((c) => c.english_name.toLowerCase().includes(query.trim().toLowerCase()))
    : sorted

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-primary text-xl">Failed to load countries.</p>
      </div>
    )
  }

  return (
    <main className="max-w-[1400px] mx-auto px-6 pt-24 pb-12">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <h1 className="font-headline-lg text-headline-lg text-white">Countries</h1>
        <input
          type="search"
          placeholder="Search countries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {isLoading ? (
        <Loading className="p-8" />
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No countries found for "{query}".</p>
      ) : (
        <ul className="flex flex-col">
          {filtered.map((c) => (
            <li key={c.iso_3166_1} className="border-b border-white/5">
              <Link
                to="/country/$id"
                params={{ id: c.iso_3166_1 }}
                className="group flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors duration-200"
              >
                <span className="text-base text-gray-300 group-hover:text-white">{c.english_name}</span>
                <svg
                  className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}