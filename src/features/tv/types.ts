export interface TmdbTvShow {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  first_air_date: string
  overview: string
}

export interface TmdbTvDetail {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  first_air_date: string
  overview: string
  genres?: { id: number; name: string }[]
  number_of_seasons?: number
  number_of_episodes?: number
  last_air_date?: string
  seasons?: { id: number; name: string; episode_count: number; poster_path: string }[]
}
