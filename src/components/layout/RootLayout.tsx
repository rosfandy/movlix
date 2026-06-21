import { useState, useEffect, type ReactNode } from 'react'
import { useLocation } from '@tanstack/react-router'
import { TopAppBar } from '@/components/layout/TopAppBar'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
import { AccountMenu } from '@/components/fragment/AccountMenu'
import { SearchOverlay } from '@/components/fragment/SearchOverlay'
import { Toaster, toast } from 'sonner'
import gsap from 'gsap'

interface RootLayoutProps {
  children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const obj = { y: window.scrollY }
    gsap.to(obj, { y: 0, duration: 0.5, ease: 'power2.out', onUpdate: () => window.scrollTo(0, obj.y) })
  }, [pathname])

  useEffect(() => {
    if (localStorage.getItem('login_toast')) {
      const username = localStorage.getItem('tmdb_username') || 'there'
      toast.success(`Welcome, ${username}!`, { icon: '🎬' })
      localStorage.removeItem('login_toast')
    }
  }, [])

  return (
    <>
      <TopAppBar renderAccount={() => <AccountMenu />} onSearchOpen={() => setSearchOpen(true)} />
      <main className="relative pb-20 md:pb-0">{children}</main>
      <BottomNavBar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toaster position="top-center" toastOptions={{ style: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', color: '#e5e2e3', border: '1px solid rgba(255,255,255,0.1)' }, classNames: { icon: 'text-[#ffb4aa]' } }} />
    </>
  )
}
