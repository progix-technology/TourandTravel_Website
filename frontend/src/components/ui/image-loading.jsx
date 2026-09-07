import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

export default function ImageLoader({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  onLoad = () => {},
}) {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#E5E0D5]/20 animate-pulse flex items-center justify-center ${className}`}>
      <LazyLoadImage
        src={src}
        alt={alt}
        effect="blur"
        afterLoad={onLoad}
        wrapperClassName="w-full h-full absolute inset-0"
        className={`w-full h-full object-cover block ${imgClassName}`}
      />
    </div>
  )
}
