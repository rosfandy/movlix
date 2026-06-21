import { Link } from '@tanstack/react-router'

interface MovieCardProps {
  title?: string
  rating?: number
  views?: number
  href?: string
  imageSrc?: string
  imageAlt?: string
  skeleton?: boolean
}

export function MovieCard({
  title,
  rating,
  views,
  href,
  imageSrc,
  imageAlt,
  skeleton,
}: MovieCardProps) {
  if (skeleton) {
    return (
      <div className="flex-none w-[140px] md:w-[160px] animate-pulse">
        <div className="aspect-[2/3] rounded-lg bg-surface-container-highest mb-3" />
        <div className="h-4 w-3/4 rounded bg-surface-container-highest" />
      </div>
    )
  }

  return (
    <Link to={href!} className="poster-card group flex-none w-[140px] md:w-[160px] cursor-pointer">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-container-highest mb-3">
        <img className="w-full h-full object-cover" src={imageSrc} alt={imageAlt} />
        {rating !== undefined && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[8px] font-bold text-white">
            <span className="material-symbols-outlined text-[16px]! text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            {rating}
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
          {views !== undefined && (
            <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
              <span className="material-symbols-outlined text-xs">visibility</span>
              {views}
            </div>
          )}
        </div>
      </div>
      <h4 className="font-bold text-sm text-white truncate group-hover:text-primary transition-colors">{title}</h4>
    </Link>
  )
}
