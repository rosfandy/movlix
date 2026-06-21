interface EpisodeCardProps {
  episodeNumber: string
  title: string
  rating: number
  duration: string
  imageSrc: string
  imageAlt: string
  isPlaying?: boolean
  href: string
}

export function EpisodeCard({
  episodeNumber,
  title,
  rating,
  duration,
  imageSrc,
  imageAlt,
  isPlaying,
  href,
}: EpisodeCardProps) {
  return (
    <a href={href} className="group cursor-pointer">
      <div className={`relative aspect-video rounded-xl overflow-hidden mb-3 transition-all ${
        isPlaying ? 'border-2 border-primary' : 'glass-panel group-hover:border-white/30'
      }`}>
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={imageSrc}
          alt={imageAlt}
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">
            {episodeNumber}
          </span>
          {isPlaying && (
            <span className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold text-white">
              PLAYING
            </span>
          )}
        </div>
        <div className="absolute bottom-2 left-2 glass-panel px-2 py-0.5 rounded flex items-center gap-1">
          <span
            className="material-symbols-outlined text-primary text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-[12px] font-bold">{rating}</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">
          {duration}
        </div>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          isPlaying ? 'bg-primary/20 opacity-40' : 'bg-black/40 opacity-0 group-hover:opacity-100'
        }`}>
          <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
        </div>
      </div>
      <h3 className="font-headline-sm text-headline-sm truncate">{title}</h3>
      <p className="text-body-sm text-on-surface-variant line-clamp-2">
        A dino park visit turns into a pulse-pounding prehistoric adventure.
      </p>
    </a>
  )
}
