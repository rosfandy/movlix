import { Link } from '@tanstack/react-router'
import { useState, useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { toast } from 'sonner'
import { useTmdbAuth } from '@/features/auth/hook/useTmdbAuth'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/series', label: 'TV Series' },
  { href: '/genres', label: 'Genres' },
  { href: '/country', label: 'Countries' },
] as const

interface TopAppBarProps {
  renderAccount?: () => ReactNode
  onSearchOpen?: () => void
}

export function TopAppBar({ renderAccount, onSearchOpen }: TopAppBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const { isLoggedIn, logout } = useTmdbAuth()

  useEffect(() => {
    const cb = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', cb)
    return () => document.removeEventListener('mousedown', cb)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(panelRef.current, { y: -20, opacity: 0, display: 'flex' }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' })
    } else {
      gsap.to(panelRef.current, { y: -20, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => { gsap.set(panelRef.current, { display: 'none' }) } })
    }
  }, [menuOpen])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    gsap.set(header, { '--bg-opacity': 0, '--blur': '0px' })
    const onScroll = () => {
      const p = Math.min(window.scrollY / 80, 1)
      gsap.to(header, { '--bg-opacity': p * 0.8, '--blur': `${p * 24}px`, duration: 0.1, overwrite: 'auto', ease: 'none' })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header ref={headerRef} className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4" style={{ backgroundColor: 'rgba(19, 19, 20, var(--bg-opacity, 0))', backdropFilter: 'blur(var(--blur, 0px))' }}>
      <div className="flex items-center gap-8">
        <Link to="/" className="font-headline-lg text-headline-md md:text-headline-lg font-black text-primary-container italic tracking-tighter">
          MOVLIX 
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="font-label-caps text-label-caps text-primary pb-1"
              activeProps={{ className: 'border-b-2 border-primary' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={onSearchOpen} className="inline-block text-on-surface transition-transform scale-95 active:scale-90 duration-300">
          <span className="material-symbols-outlined">search</span>
        </button>
        <div className="hidden md:block">
          {renderAccount?.()}
        </div>
        <div ref={menuRef} className="relative md:hidden">
          <button onClick={() => setMenuOpen((p) => !p)} className="text-on-surface transition-transform scale-95 active:scale-90 duration-300">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div ref={panelRef} className="fixed left-0 w-full top-17 z-[110] bg-surface/95 backdrop-blur-xl flex-col p-6 gap-1 border-b border-outline-variant/10 shadow-xl" style={{ display: 'none' }}>
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-body-lg rounded-xl hover:bg-surface-container-higher transition-colors">
                {item.label}
              </Link>
            ))}
            <hr className="border-outline-variant/10 my-2" />
            <Link to="/mylist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-body-lg rounded-xl hover:bg-surface-container-higher transition-colors">
              <span className="material-symbols-outlined">favorite</span>
              Favorites
            </Link>
            {isLoggedIn && (
              <>
                <hr className="border-outline-variant/10 my-2" />
                <button onClick={() => { setMenuOpen(false); logout(); toast.success('Logged out', { icon: '👋' }) }} className="flex items-center gap-3 px-4 py-3 text-body-lg w-full text-left rounded-xl hover:bg-surface-container-higher transition-colors">
                  <span className="material-symbols-outlined">logout</span>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
