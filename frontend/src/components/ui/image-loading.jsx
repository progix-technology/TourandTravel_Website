import React from 'react'

export default function ImageLoader({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  onLoad = () => {},
}) {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#071A16] flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={onLoad}
        className={`w-full h-full object-cover block ${imgClassName}`}
      />
    </div>
  )
}
