export interface TmdbMovie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  release_date: string
  overview: string
  runtime?: number
  genres?: { id: number; name: string }[]
}

export interface TmdbVideo {
  id: string
  key: string
  site: string
  type: string
}

export interface Movie {
  id: number
  title: string
  year: string | undefined
  rating: number
  href: string
  imageSrc: string
  imageAlt: string
  backdrop: string
  overview: string
  runtime?: number
  genres?: { id: number; name: string }[]
  trailerKey?: string
}

export interface TmdbReview {
  author: string
  author_details: { name: string; username: string; avatar_path: string | null; rating: number | null }
  content: string
  created_at: string
  url: string
}
