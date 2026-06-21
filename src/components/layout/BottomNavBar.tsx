import { Link, useRouterState } from '@tanstack/react-router'

const navItems = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/mylist', label: 'Favorites', icon: 'favorite' },
] as const

interface BottomNavBarProps {
  onSearchOpen?: () => void
}

export function BottomNavBar({ onSearchOpen }: BottomNavBarProps) {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container/90 backdrop-blur-lg border-t border-outline-variant/10 shadow-lg">
      <button onClick={onSearchOpen} className="flex flex-col items-center justify-center p-2 rounded-lg active:scale-95 transition-transform text-on-surface-variant hover:bg-white/5">
        <span className="material-symbols-outlined">search</span>
        <span className="font-label-caps text-[10px] mt-1">Search</span>
      </button>
      {navItems.map((item) => {
        const isActive = pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center p-2 rounded-lg active:scale-95 transition-transform ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-[10px] mt-1">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
