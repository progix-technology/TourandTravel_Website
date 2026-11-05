import React from 'react'
import { X, CheckCircle2 } from 'lucide-react'

export const BookingDetailModal = ({
  selectedBookingModal,
  onClose,
}) => {
  if (!selectedBookingModal) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#081C16] border border-white/10 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/60 hover:text-white p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#6FCF45]/15 text-[#6FCF45] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Confirmed Travel Voucher</h3>
            <span className="font-mono text-[10px] text-[#94A3B8]">
              ID: {selectedBookingModal.id || selectedBookingModal.bookingReference || 'TT-849201'}
            </span>
          </div>
        </div>

        <div className="bg-[#0B241E] border border-white/5 rounded-2xl p-4 space-y-2 text-xs text-[#94A3B8] mb-5">
          <div className="flex justify-between">
            <span className="text-white font-bold">Tour:</span>{' '}
            <span>{selectedBookingModal.title || selectedBookingModal.tourTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white font-bold">Dates:</span>{' '}
            <span>{selectedBookingModal.dates || selectedBookingModal.travelDate || 'Flexible 2025'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white font-bold">Travelers:</span>{' '}
            <span>{selectedBookingModal.travelers || '2 Explorers'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white font-bold">Status:</span>{' '}
            <span className="text-[#6FCF45] font-bold">Confirmed &amp; Secured</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.print()
            }}
            className="flex-1 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center cursor-pointer shadow-sm"
          >
            Print / Download PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingDetailModal

