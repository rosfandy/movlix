import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useTmdbAuth } from '@/features/auth/hook/useTmdbAuth'

export function AccountMenu() {
  const { isLoggedIn, loading, login, logout } = useTmdbAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cb = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', cb)
    return () => document.removeEventListener('mousedown', cb)
  }, [])

  if (loading) {
    return (
      <button disabled className="flex items-center gap-2 group cursor-pointer transition-transform scale-95 active:scale-90 duration-300">
        <div className="w-8 h-8 rounded-full bg-outline-variant/30 animate-pulse" />
        <span className="font-label-caps text-label-caps text-on-surface-variant">Loading...</span>
      </button>
    )
  }

  if (!isLoggedIn) {
    return (
      <button onClick={login} className="flex items-center gap-2 group cursor-pointer transition-transform scale-95 active:scale-90 duration-300">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 flex items-center justify-center bg-primary-container/20">
          <span className="material-symbols-outlined text-sm">person</span>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-on-surface">Login</span>
      </button>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((p) => !p)} className="flex items-center gap-2 group cursor-pointer transition-transform scale-95 active:scale-90 duration-300">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 flex items-center justify-center bg-primary/20">
          <span className="material-symbols-outlined text-sm">person</span>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-on-surface">Account</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-surface-container-high border border-outline-variant/20 shadow-xl overflow-hidden z-50">
          <Link to="/mylist" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-body-sm hover:bg-surface-container-higher transition-colors">
            <span className="material-symbols-outlined text-sm">favorite</span>
            Favorites
          </Link>
          <hr className="border-outline-variant/10" />
          <button onClick={() => { setOpen(false); logout(); toast.success('Logged out', { icon: '👋' }) }} className="flex items-center gap-3 px-4 py-3 text-body-sm w-full text-left hover:bg-surface-container-higher transition-colors">
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
