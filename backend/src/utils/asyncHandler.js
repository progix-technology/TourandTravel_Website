/**
 * asyncHandler
 * Higher-order function that catches async errors in Express routes and forwards to next()
 * Eliminates repetitive try-catch blocks across all controllers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler

