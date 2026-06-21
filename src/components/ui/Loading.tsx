import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface LoadingProps {
  fullPage?: boolean
  className?: string
}

export function Loading({ fullPage, className = '' }: LoadingProps) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.ldot', {
        scale: 1.5,
        opacity: 0.3,
        duration: 0.6,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.15,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={el}
      className={`flex items-center justify-center gap-2 ${fullPage ? 'min-h-screen pt-24' : ''} ${className}`}
    >
      {[0,1,2].map(i => (
        <div key={i} className="ldot w-2.5 h-2.5 rounded-full bg-primary" />
      ))}
    </div>
  )
}
