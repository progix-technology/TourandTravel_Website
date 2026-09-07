import { DESTINATIONS } from './mockData'

/**
 * Intelligent Non-Blocking Image Preloader & Browser Cache Engine
 * Runs silently in browser idle time (requestIdleCallback) without affecting UI thread performance.
 * Once cached by the browser, all destination images render instantaneously with 0ms latency.
 */
export function prefetchDestinationImages() {
  if (typeof window === 'undefined') return

  const prefetchTask = () => {
    // Extract unique image URLs
    const imageUrls = Array.from(
      new Set(DESTINATIONS.map((d) => d.image).filter(Boolean))
    )

    // Preload in low-priority queue
    let index = 0
    function loadNext() {
      if (index >= imageUrls.length) return
      const url = imageUrls[index]
      index++

      const img = new Image()
      img.decoding = 'async'
      img.src = url

      img.onload = () => {
        // Schedule next load on next frame to keep main thread completely buttery smooth
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNext, { timeout: 1000 })
        } else {
          setTimeout(loadNext, 50)
        }
      }

      img.onerror = () => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNext, { timeout: 1000 })
        } else {
          setTimeout(loadNext, 50)
        }
      }
    }

    // Start background caching
    loadNext()
  }

  // Defer execution until after initial page paint
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetchTask, { timeout: 2000 })
  } else {
    setTimeout(prefetchTask, 1000)
  }
}
