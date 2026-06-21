// ponytail: TMDB OAuth callback — bypass TanStack Router's useSearch, read URL params directly

import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { createSession, fetchTmdbAccount } from '@/features/auth/hook/useTmdbAuth'

function CallbackPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const request_token = params.get('request_token')
    const approved = params.get('approved')

    if (request_token && approved === 'true') {
      createSession(request_token)
        .then(async (res) => {
          const sid = res.session_id
          if (sid) {
            localStorage.setItem('tmdb_session_id', sid)
            const account = await fetchTmdbAccount(sid)
            localStorage.setItem('tmdb_username', account.username)
            localStorage.setItem('tmdb_account_id', String(account.id))
            localStorage.setItem('login_toast', 'true')
            window.location.href = import.meta.env.BASE_URL
          } else {
            setError('session_id kosong dari TMDB')
          }
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to create session')
        })
    } else {
      window.location.href = import.meta.env.BASE_URL
    }
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-on-surface">
        <p>Login gagal: {error}</p>
      </div>
    )
  }

  return null
}

export const Route = createFileRoute('/auth/callback')({
  component: CallbackPage,
})