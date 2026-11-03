import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'

export const ImageWithSkeleton = ({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  skeletonTheme = 'dark', // 'dark' | 'light'
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  onError,
  onLoad,
  fallbackSrc = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = (e) => {
    setIsLoaded(true)
    onLoad && onLoad(e)
  }

  const handleError = (e) => {
    setHasError(true)
    if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc
    }
    onError && onError(e)
  }

  const skeletonClass =
    skeletonTheme === 'light' ? 'luxury-skeleton-light' : 'luxury-skeleton'

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      {/* Animated Skeleton Shimmer (Visible until image loads) */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 z-10 ${skeletonClass} flex items-center justify-center transition-opacity duration-500`}
        >
          <div className="flex flex-col items-center justify-center gap-2 opacity-30 select-none pointer-events-none">
            <div className="w-8 h-8 rounded-full border border-[#6FCF45]/40 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-[#6FCF45]" />
            </div>
          </div>
        </div>
      )}

      {/* Target Image with Smooth Fade-in */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
        } ${imgClassName}`}
        {...props}
      />
    </div>
  )
}

export default ImageWithSkeleton

