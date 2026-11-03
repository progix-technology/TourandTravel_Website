import React, { useEffect } from 'react'
import { initiateRazorpayPayment } from '../services/razorpayService'

export const RazorpayCheckoutModal = ({
  isOpen,
  onClose,
  amount,
  tourTitle,
  customerName,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
}) => {
  useEffect(() => {
    if (isOpen) {
      initiateRazorpayPayment({
        amount,
        tourTitle,
        customerName,
        customerEmail,
        customerPhone,
        onSuccess: (result) => {
          onPaymentSuccess && onPaymentSuccess(result)
          onClose && onClose()
        },
        onError: () => {
          onClose && onClose()
        },
      })
    }
  }, [isOpen])

  return null
}

export default RazorpayCheckoutModal
