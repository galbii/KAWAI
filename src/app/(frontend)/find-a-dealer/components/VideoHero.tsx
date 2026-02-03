'use client'

interface Props {
  youtubeVideoId: string
  title: string
  description: string
}

export function VideoHero({ youtubeVideoId, title, description }: Props) {
  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0">
        <iframe
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh]"
          style={{
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
          title="Background video"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex items-center justify-center text-center px-6">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
