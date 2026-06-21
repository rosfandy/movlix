// ponytail: TMDB OAuth — request token → redirect → session_id in localStorage

import { useState, useCallback, useEffect } from 'react'
import { fetchTmdb, tmdb } from '@/config/tmdb'
import type { TmdbAccount } from '@/features/auth/types'

const SESSION_KEY = 'tmdb_session_id'

export interface TmdbSession {
  success: boolean
  session_id: string
}

export async function fetchRequestToken() {
  return fetchTmdb<{ request_token: string }>('/authentication/token/new')
}

export async function createSession(requestToken: string) {
  const { data } = await tmdb.post<TmdbSession>('/authentication/session/new', {
    request_token: requestToken,
  }, { params: { api_key: import.meta.env.VITE_TMDB_API_KEY } })
  return data
}

export async function deleteSession(sessionId: string) {
  await tmdb.delete('/authentication/session', {
    params: { api_key: import.meta.env.VITE_TMDB_API_KEY },
    data: { session_id: sessionId },
  })
}

export async function fetchTmdbAccount(sessionId: string): Promise<TmdbAccount> {
  return fetchTmdb<TmdbAccount>('/account', { session_id: sessionId })
}

export function useTmdbAuth() {
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessionId) localStorage.setItem(SESSION_KEY, sessionId)
    else localStorage.removeItem(SESSION_KEY)
  }, [sessionId])

  const login = useCallback(async () => {
    setLoading(true)
    try {
      const { request_token } = await fetchRequestToken()
      const cb = encodeURIComponent(`${window.location.origin}/auth/callback`)
      window.location.href = `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=${cb}`
    } catch {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    if (sessionId) {
      try { await deleteSession(sessionId) } catch { /* ignore */ }
    }
    setSessionId(null)
    window.location.reload()
  }, [sessionId])

  const completeLogin = useCallback(async (requestToken: string) => {
    setLoading(true)
    try {
      const { session_id } = await createSession(requestToken)
      setSessionId(session_id)
    } finally {
      setLoading(false)
    }
  }, [])

  return { sessionId, isLoggedIn: !!sessionId, loading, login, logout, completeLogin }
}
