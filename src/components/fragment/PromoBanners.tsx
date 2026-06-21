export function PromoBanners() {
  return (
    <section className="px-margin-desktop py-8 -mt-20 relative z-20 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-24 glass-panel rounded-xl flex items-center justify-between px-8 overflow-hidden group cursor-pointer border-primary/20">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-4xl">loyalty</span>
          <div>
            <h4 className="font-bold text-lg text-white">MEMBER BARU QQ724</h4>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest">Special Welcome Bonus</p>
          </div>
        </div>
        <span className="text-primary font-black italic text-2xl group-hover:scale-110 transition-transform">LEVEL 1</span>
      </div>
      <div className="h-24 glass-panel rounded-xl flex items-center justify-between px-8 overflow-hidden group cursor-pointer border-secondary/20">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-4xl">emoji_events</span>
          <div>
            <h4 className="font-bold text-lg text-white">QQ828 LEVELING</h4>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest">Monthly Tournament</p>
          </div>
        </div>
        <span className="text-secondary font-black italic text-2xl group-hover:scale-110 transition-transform">AUTO KAYA</span>
      </div>
    </section>
  )
}
