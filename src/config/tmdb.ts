// ponytail: constants, generic fetcher, mappers — all fetch functions live in feature hooks

import axios from 'axios'
import type { TmdbMovie, Movie } from '@/features/movies/types'
import type { TmdbTvShow } from '@/features/tv/types'

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_V4_BASE_URL = 'https://api.themoviedb.org/4'
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
export const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN

const tmdb = axios.create({ baseURL: TMDB_BASE_URL })
export { tmdb }

export const slugify = (s: string | undefined) => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const tmdbV4 = axios.create({ baseURL: TMDB_V4_BASE_URL })

export async function fetchTmdb<T = any>(path: string, params?: Record<string, any>): Promise<T> {
  if (!TMDB_API_KEY) throw new Error('VITE_TMDB_API_KEY missing')
  const { data } = await tmdb.get<T>(path, { params: { ...params, api_key: TMDB_API_KEY } })
  return data
}

export function mapMovie(m: TmdbMovie): Movie {
  return {
    id: m.id, title: m.title, year: m.release_date?.slice(0, 4),
    rating: Math.round(m.vote_average * 10) / 10, href: `/movies/${slugify(m.title)}`,
    imageSrc: m.poster_path ? `${TMDB_IMAGE_BASE}/w500${m.poster_path}` : '',
    imageAlt: `Movie poster for ${m.title}`,
    backdrop: m.backdrop_path ? `${TMDB_IMAGE_BASE}/original${m.backdrop_path}` : '',
    overview: m.overview, runtime: m.runtime, genres: m.genres,
  }
}

export function mapTvShow(s: TmdbTvShow): Movie {
  return {
    id: s.id, title: s.name, year: s.first_air_date?.slice(0, 4),
    rating: Math.round(s.vote_average * 10) / 10, href: `/series/${slugify(s.name)}`,
    imageSrc: s.poster_path ? `${TMDB_IMAGE_BASE}/w500${s.poster_path}` : '',
    imageAlt: `Poster for ${s.name}`,
    backdrop: s.backdrop_path ? `${TMDB_IMAGE_BASE}/original${s.backdrop_path}` : '',
    overview: s.overview,
  }
}

export const LIST_ID = 8663826
