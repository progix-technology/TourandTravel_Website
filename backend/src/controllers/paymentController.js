import Razorpay from 'razorpay'
import crypto from 'crypto'
import Settings from '../models/Settings.js'

// Helper to get Razorpay Instance dynamically from DB or .env
const getRazorpayInstance = async () => {
  let key_id = process.env.RAZORPAY_KEY_ID
  let key_secret = process.env.RAZORPAY_KEY_SECRET

  try {
    const settings = await Settings.findOne()
    if (settings?.razorpayKeyId && settings.razorpayKeyId.trim() && !settings.razorpayKeyId.includes('YourKeyHere')) {
      key_id = settings.razorpayKeyId.trim()
    }
    if (settings?.razorpayKeySecret && settings.razorpayKeySecret.trim() && !settings.razorpayKeySecret.includes('YourSecretHere')) {
      key_secret = settings.razorpayKeySecret.trim()
    }
    if (settings?.razorpayEnabled === false) {
      return { instance: null, key_id: null, key_secret: null, isConfigured: false }
    }
  } catch (err) {
    console.warn('DB settings read notice:', err.message)
  }

  if (!key_id || !key_secret) {
    return {
      instance: null,
      key_id: null,
      key_secret: null,
      isConfigured: false,
    }
  }

  try {
    const instance = new Razorpay({
      key_id,
      key_secret,
    })
    return { instance, key_id, key_secret, isConfigured: true }
  } catch (initErr) {
    console.error('Razorpay SDK init error:', initErr)
    return { instance: null, key_id, key_secret, isConfigured: false }
  }
}

// @desc    Get Razorpay Public Key & Configuration Status for Frontend
// @route   GET /api/v1/payment/razorpay-key
// @access  Public
export const getRazorpayKey = async (req, res) => {
  try {
    const { key_id, isConfigured } = await getRazorpayInstance()
    res.json({
      success: true,
      keyId: key_id || '',
      isConfigured: !!isConfigured,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc    Create Official Razorpay Order
// @route   POST /api/v1/payment/create-order
// @access  Public / Authenticated
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' })
    }

    const { instance, key_id, isConfigured } = await getRazorpayInstance()

    // Without credentials, do NOT fake or mock orders
    if (!instance || !isConfigured || !key_id) {
      return res.status(400).json({
        success: false,
        isConfigured: false,
        message: 'Razorpay Gateway is not configured. Admin must add Razorpay Key ID and Key Secret in Admin Dashboard > Settings > Payment Gateway.',
      })
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    }

    const order = await instance.orders.create(options)

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id,
      isConfigured: true,
    })
  } catch (err) {
    console.error('Razorpay Order Error:', err)
    res.status(500).json({
      success: false,
      message: err.error?.description || err.message || 'Razorpay order creation failed. Please verify credentials.',
    })
  }
}

// @desc    Verify Official Razorpay Payment Signature
// @route   POST /api/v1/payment/verify
// @access  Public / Authenticated
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Incomplete payment verification payload.',
      })
    }

    const { key_secret, isConfigured } = await getRazorpayInstance()

    if (!isConfigured || !key_secret) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Razorpay credentials not found on server.',
      })
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      res.json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      })
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        message: 'Payment verification failed: Signature mismatch',
      })
    }
  } catch (err) {
    console.error('Razorpay Verify Error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc    Get Current Payment Gateway Settings (Admin)
// @route   GET /api/v1/payment/admin-settings
// @access  Public / Admin
export const getAdminPaymentSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create({})
    }

    res.json({
      success: true,
      settings: {
        razorpayEnabled: settings.razorpayEnabled !== false,
        razorpayKeyId: settings.razorpayKeyId || '',
        razorpayKeySecret: settings.razorpayKeySecret ? '••••••••••••••••' : '',
        razorpayWebhookSecret: settings.razorpayWebhookSecret ? '••••••••••••••••' : '',
        currency: settings.currency || 'INR',
        isConfigured: !!(settings.razorpayKeyId && settings.razorpayKeySecret),
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc    Update Razorpay Account Keys (Admin)
// @route   PUT /api/v1/payment/admin-settings
// @access  Public / Admin
export const updateAdminPaymentSettings = async (req, res) => {
  try {
    const { razorpayEnabled, razorpayKeyId, razorpayKeySecret, razorpayWebhookSecret, currency } = req.body

    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings({})
    }

    if (razorpayEnabled !== undefined) settings.razorpayEnabled = !!razorpayEnabled
    if (razorpayKeyId !== undefined) settings.razorpayKeyId = razorpayKeyId.trim()
    if (razorpayKeySecret && razorpayKeySecret !== '••••••••••••••••') {
      settings.razorpayKeySecret = razorpayKeySecret.trim()
    }
    if (razorpayWebhookSecret && razorpayWebhookSecret !== '••••••••••••••••') {
      settings.razorpayWebhookSecret = razorpayWebhookSecret.trim()
    }
    if (currency) settings.currency = currency

    await settings.save()

    const isConfigured = !!(settings.razorpayKeyId && settings.razorpayKeySecret && settings.razorpayEnabled !== false)

    res.json({
      success: true,
      message: 'Razorpay account credentials updated successfully in database!',
      isConfigured,
      settings: {
        razorpayEnabled: settings.razorpayEnabled,
        razorpayKeyId: settings.razorpayKeyId,
        currency: settings.currency,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc    Razorpay Server Webhook Receiver (Optional for auto-syncing background payments)
// @route   POST /api/v1/payment/webhook
// @access  Public (Webhook verification via HMAC-SHA256)
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const settings = await Settings.findOne()
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || settings?.razorpayWebhookSecret

    if (!webhookSecret) {
      return res.status(200).json({ status: 'ok', message: 'Webhook received (No webhook secret configured)' })
    }

    const signature = req.headers['x-razorpay-signature']
    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature header' })
    }

    const shasum = crypto.createHmac('sha256', webhookSecret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    if (digest !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' })
    }

    const event = req.body?.event
    console.log(`✅ Verified Razorpay Webhook Event: ${event}`)
    res.status(200).json({ status: 'ok' })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ success: false, message: err.message })
  }
}
