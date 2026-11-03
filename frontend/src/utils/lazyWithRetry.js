import { lazy } from 'react'

/**
 * Enhanced React.lazy with automatic chunk-retry mechanism.
 * Handles stale chunk cache when a new production build is deployed.
 */
export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('tt_chunk_force_refreshed') || 'false'
    )

    try {
      const component = await componentImport()
      window.sessionStorage.setItem('tt_chunk_force_refreshed', 'false')
      return component
    } catch (error) {
      if (!pageHasBeenForceRefreshed) {
        // Chunk failed to load (usually after a new build deployment)
        console.warn('Chunk load error detected, auto-reloading page...', error)
        window.sessionStorage.setItem('tt_chunk_force_refreshed', 'true')
        window.location.reload()
        return { default: () => null }
      }
      throw error
    }
  })

export default lazyWithRetry

