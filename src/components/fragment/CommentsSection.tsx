import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTmdbAuth } from '@/features/auth/hook/useTmdbAuth'
import { fetchTmdbAccount } from '@/features/auth/hook/useTmdbAuth'
import { addListItems, appendListComment, useListComments } from '@/features/list/hook/useListComments'
import { LIST_ID } from '@/config/tmdb'
import type { TmdbReview } from '@/features/movies/types'

const avatarBg = [
  'bg-pink-700', 'bg-red-600', 'bg-red-900', 'bg-blue-600',
  'bg-green-700', 'bg-purple-600', 'bg-amber-700', 'bg-teal-700',
]

interface CommentsSectionProps {
  reviews: TmdbReview[]
  mediaType: 'movie' | 'tv'
  mediaId: number
}

export function CommentsSection({ reviews, mediaType, mediaId }: CommentsSectionProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [comment, setComment] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)
  const { isLoggedIn, login } = useTmdbAuth()
  const queryClient = useQueryClient()
  const { data: listComments = [] } = useListComments(mediaType, mediaId)

  const allComments = [...listComments, ...reviews.map((r) => ({
    author: r.author,
    comment: r.content,
    created_at: r.created_at,
  }))].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const handlePost = async () => {
    if (!comment.trim() || !isLoggedIn) return
    setPosting(true)
    setPostError(null)
    try {
      const sessionId = localStorage.getItem('tmdb_session_id') ?? undefined
      let username = localStorage.getItem('tmdb_username')
      if (!username && sessionId) {
        try {
          const account = await fetchTmdbAccount(sessionId)
          username = account.username
          localStorage.setItem('tmdb_username', username)
        } catch { /* fallback below */ }
      }
      username = username || 'Anonymous'
      const entry = { name: username, comment: comment.trim(), time: Date.now() }
      const res = await addListItems(LIST_ID, [{ media_type: mediaType, media_id: mediaId }], sessionId)
      const alreadyTaken = res.results.some((r) => !r.success)
      if (alreadyTaken) {
        await appendListComment(LIST_ID, mediaType, mediaId, entry, sessionId)
      } else {
        await appendListComment(LIST_ID, mediaType, mediaId, entry, sessionId)
      }
      setComment('')
      queryClient.invalidateQueries({ queryKey: ['list-comments', mediaType, mediaId] })
      toast.success('Comment posted!', { icon: '💬' })
    } catch (err) {
      setPostError(err instanceof Error ? err.message : 'Failed to post comment')
      toast.error('Failed to post comment', { icon: '💬' })
    } finally {
      setPosting(false)
    }
  }

  return (
    <section className="px-margin-desktop py-row-gap max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-4">
          <h2 className="font-headline-lg text-headline-lg">
            Comments <span className="text-on-surface-variant text-sm ml-2">{allComments.length}</span>
          </h2>
        </div>
      </div>

      {isLoggedIn ? (
        <div className="w-full bg-surface-container border border-outline-variant/20 rounded-xl p-6 mb-12">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-transparent border border-outline-variant/30 rounded-lg p-3 text-body-sm text-white resize-none focus:outline-none focus:border-primary placeholder:text-on-surface-variant"
            rows={3}
          />
          {postError && <p className="text-red-400 text-xs mt-2">{postError}</p>}
          <div className="flex justify-end mt-3">
            <button
              onClick={handlePost}
              disabled={!comment.trim() || posting}
              className="px-6 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-surface-container border border-outline-variant/20 rounded-xl p-8 mb-12 text-center">
          <p className="text-on-surface-variant">
            <button onClick={login} className="text-primary font-bold cursor-pointer hover:underline">Sign in</button> to post a comment
          </p>
        </div>
      )}

      {allComments.length > 0 ? (
        <div className="space-y-10" data-purpose="comment-list">
          {allComments.map((c, i) => {
            const initial = c.author.charAt(0).toUpperCase()
            const bgColor = avatarBg[i % avatarBg.length]
            return (
              <div key={i} className="space-y-6">
                <div className="flex gap-4 relative">
                  <div className="flex-shrink-0 z-10">
                    <div className={`w-10 h-10 rounded-full overflow-hidden ${bgColor} flex items-center justify-center text-white font-bold`}>
                      {initial}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm truncate">{c.author}</span>
                      <span className="text-xs text-on-surface-variant">@{c.author.toLowerCase().replace(/\s+/g, '')}</span>
                      <span className="text-xs text-on-surface-variant">
                        {c.created_at
                          ? (() => {
                              const days = Math.floor((Date.now() - new Date(c.created_at).getTime()) / 86400000)
                              return days < 1 ? 'today' : days < 7 ? `${days}d ago` : days < 30 ? `${Math.floor(days / 7)}w ago` : c.created_at.slice(0, 10)
                            })()
                          : ''}
                      </span>
                    </div>
                    <p className={`text-body-sm text-white ${!expanded[i] ? 'line-clamp-3' : ''}`}>
                      {c.comment}
                    </p>
                    {c.comment.length > 200 && (
                      <button
                        onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
                        className="text-primary text-xs font-bold mt-1 hover:underline"
                      >
                        {expanded[i] ? 'show less' : '...read more'}
                      </button>
                    )}
                    
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
          <span className="material-symbols-outlined text-6xl mb-4">forum</span>
          <p className="font-headline-sm">No comments yet.</p>
          <p className="text-body-md">Be the first to share your thoughts!</p>
        </div>
      )}
    </section>
  )
}
