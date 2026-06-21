export interface TmdbRequestToken {
  success: boolean
  expires_at: string
  request_token: string
}

export interface TmdbSession {
  success: boolean
  session_id: string
}

export interface TmdbAccount {
  id: number
  name: string
  username: string
}

export interface TmdbGuestSession {
  success: boolean
  guest_session_id: string
  expires_at: string
}
