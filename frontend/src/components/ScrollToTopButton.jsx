import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top of page"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#071A16]/90 hover:bg-[#6FCF45] text-[#6FCF45] hover:text-[#071A16] border-2 border-[#6FCF45]/60 hover:border-[#6FCF45] backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_30px_rgba(111,207,69,0.4)] flex items-center justify-center transition-colors duration-300 group cursor-pointer"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.8] transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTopButton
