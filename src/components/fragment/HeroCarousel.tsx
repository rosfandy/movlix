import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { slugify } from '@/config/tmdb'

interface HeroCarouselProps {
  items: {
    id: number
    backdrop: string
    title: string
    overview: string
    year: string | undefined
    rating: number
  }[]
  autoAdvanceMs?: number
  tag?: string
  linkPrefix?: string
}

export function HeroCarousel({ items, autoAdvanceMs = 5000, tag = 'MOVIE', linkPrefix = '/movies/' }: HeroCarouselProps) {
  const [idx, setIdx] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const go = useCallback((next: number) => {
    setIdx(next)
    gsap.to(trackRef.current, {
      x: `-${next * 100}%`,
      duration: 0.8,
      ease: 'power2.inOut',
    })
  }, [])

  useEffect(() => {
    if (items.length === 0) return
    const timer = setInterval(() => {
      const next: number = (idx + 1) % items.length
      go(next)
    }, autoAdvanceMs)
    return () => clearInterval(timer)
  }, [items.length, idx, autoAdvanceMs, go])

  if (items.length === 0) return null
  const current = items[idx]

  return (
    <section className="relative h-[870px] w-full flex items-center overflow-hidden">
      {/* Slides */}
      <div ref={trackRef} className="absolute inset-0 flex w-full">
        {items.map((item) => (
          <div key={item.title} className="w-full h-full flex-shrink-0 relative">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${item.backdrop}')` }}
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-margin-desktop max-w-4xl pt-24">
        <span className="uppercase inline-block px-3 py-1 bg-primary-container text-on-primary-container font-label-caps text-label-caps mb-4 rounded-sm">
          {tag}
        </span>
        <p className="italic text-on-surface-variant mb-2 font-body-md">
          {current.overview?.slice(0, 60) ?? ''}
        </p>
        <h1 className="font-display-hero text-display-hero text-white mb-4 uppercase tracking-tight">
          {current.title?.toUpperCase() ?? 'LOADING...'}
        </h1>
        <h2 className="font-headline-lg text-headline-lg text-on-surface-variant/80 -mt-6 mb-6 tracking-widest uppercase">
          {current.year ?? ''}
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="font-bold">{current.rating ?? '0'}</span>
          </div>
          <span className="text-on-surface-variant font-body-sm">
            {current.year ?? ''} • Movie
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={`${linkPrefix}${slugify(current.title)}`}
            className="bg-primary-container hover:bg-primary-container/80 text-on-primary-container px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-300 font-bold scale-100 hover:scale-105 active:scale-95 shadow-lg shadow-primary-container/20"
          >
            <span className="material-symbols-outlined">play_arrow</span>
            Watch Now
          </Link>
          <FavoriteButton mediaType="movie" mediaId={current.id} className="glass-panel text-on-surface px-4 py-3 rounded-full" />
        </div>

        {/* Indicators — all items, clickable, GSAP slides */}
        <div className="flex gap-2 mt-12">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`rounded-full transition-colors duration-300 ${
                i === idx ? 'w-8 h-1.5 bg-primary-container' : 'w-1.5 h-1.5 bg-on-surface-variant/30 hover:bg-on-surface-variant/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
