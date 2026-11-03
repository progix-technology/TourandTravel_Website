import api from './api'

/**
 * Load Razorpay Checkout SDK dynamically from official Razorpay CDN
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Fetch whether Razorpay is configured on backend
 */
export const checkRazorpayConfigured = async () => {
  try {
    const res = await api.get('/payment/razorpay-key')
    return {
      isConfigured: !!res.data?.isConfigured,
      keyId: res.data?.keyId || '',
    }
  } catch (err) {
    return { isConfigured: false, keyId: '' }
  }
}

/**
 * Launch the Real Official Razorpay Checkout Modal (Official Site Integration)
 * Only operates with real server-generated orders and merchant keys.
 */
export const initiateRazorpayPayment = async ({
  amount,
  notes = {},
  customerName = 'Valued Guest',
  customerEmail = '',
  customerPhone = '',
  tourTitle = 'Luxury Tour Booking',
  onSuccess,
  onError,
}) => {
  try {
    // 1. Ensure official Razorpay SDK is loaded
    const isLoaded = await loadRazorpayScript()
    if (!isLoaded || !window.Razorpay) {
      const msg = 'Razorpay official Checkout SDK could not be loaded. Please check your internet connection.'
      alert(msg)
      onError && onError(msg)
      return
    }

    // 2. Create Real Razorpay Order on Backend
    let orderRes
    try {
      orderRes = await api.post('/payment/create-order', {
        amount,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          tourTitle,
          customerName,
          customerEmail,
          ...notes,
        },
      })
    } catch (apiErr) {
      const errorMsg =
        'Online payment gateway is temporarily undergoing routine banking maintenance. Please select "Pay on Arrival" to confirm your booking immediately, or contact our 24/7 concierge.'
      alert(errorMsg)
      onError && onError(errorMsg)
      return
    }

    const { orderId, keyId, isConfigured } = orderRes.data

    if (!isConfigured || !keyId || !orderId) {
      const errNotice =
        'Online payment gateway is temporarily undergoing routine banking maintenance. Please select "Pay on Arrival" to confirm your booking immediately.'
      alert(errNotice)
      onError && onError(errNotice)
      return
    }

    // 3. Official Razorpay Standard Checkout Options
    const options = {
      key: keyId,
      amount: Math.round(Number(amount || 0) * 100),
      currency: 'INR',
      name: 'Tours & Travellers',
      description: tourTitle,
      image: 'https://cdn.razorpay.com/logos/GhNZAGtrnGQXBx_medium.png',
      order_id: orderId, // Real order created by Razorpay API
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      theme: {
        color: '#0c2340',
        backdrop_color: '#071A16',
      },
      modal: {
        ondismiss: function () {
          onError && onError('Payment cancelled by user')
        },
      },
      handler: async function (response) {
        try {
          // 4. Verify Payment Signature securely on backend
          const verifyRes = await api.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })

          if (verifyRes.data?.success && verifyRes.data?.verified) {
            onSuccess &&
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                method: 'Razorpay Official Gateway',
                status: 'Paid & Secured (Razorpay Verified)',
              })
          } else {
            alert('Payment signature verification failed. Please contact support.')
            onError && onError('Verification signature mismatch')
          }
        } catch (vErr) {
          console.error('Payment verification error:', vErr)
          alert('Payment verification could not be completed. Please contact support.')
          onError && onError(vErr.message)
        }
      },
    }

    // 5. Open Official Real Razorpay Modal
    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', function (failResp) {
      console.error('Razorpay payment failed:', failResp.error)
      alert(failResp.error?.description || 'Payment was declined or failed.')
      onError && onError(failResp.error?.description)
    })
    rzp.open()
  } catch (err) {
    console.error('Razorpay Checkout Exception:', err)
    alert(err.message || 'Could not initiate Razorpay Checkout.')
    onError && onError(err)
  }
}

export default initiateRazorpayPayment
