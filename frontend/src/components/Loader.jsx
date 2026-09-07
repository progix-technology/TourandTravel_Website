import React, { useMemo } from 'react'

export const Loader = ({ label = 'LOADING EXPEDITION...' }) => {
  const cells = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 1200,
    }))
  }, [])

  return (
    <div className="min-h-[550px] w-full flex flex-col items-center justify-center gap-6 py-24 bg-[#071A16] text-white select-none">
      <style>{`
        @keyframes matrixGridBlink {
          0%, 100% { opacity: 0.2; transform: scale(0.85); background-color: #12382E; }
          50% { opacity: 1; transform: scale(1.1); background-color: #6FCF45; box-shadow: 0 0 12px rgba(111, 207, 69, 0.6); }
        }
      `}</style>

      {/* Modern Grid Blinking Matrix Loader (6x6) */}
      <div className="grid grid-cols-6 gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md">
        {cells.map((cell) => (
          <div
            key={cell.id}
            className="w-3.5 h-3.5 rounded-full bg-[#12382E]"
            style={{
              animation: 'matrixGridBlink 1200ms infinite',
              animationDelay: `${cell.delay}ms`,
              animationFillMode: 'backwards',
            }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-[0.3em] text-[#6FCF45] font-bold font-heading animate-pulse">
          {label}
        </span>
        <span className="text-[11px] text-[#A8B5AF] tracking-wider font-medium">
          Rendering high-resolution captures...
        </span>
      </div>
    </div>
  )
}

export default Loader
