/**
 * Schema Validation Middleware (Clean, Fast, Zero Dependencies)
 * Validates request bodies before execution reaches controllers.
 * Returns structured 400 Bad Request with field-level errors.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[\d\s+\-()]{7,20}$/

export const validate = (validationFn) => {
  return (req, res, next) => {
    const errors = validationFn(req.body || {})
    if (errors && errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check the submitted fields.',
        errors,
      })
    }
    next()
  }
}

// 1. Login Validation Schema
export const validateLogin = validate((data) => {
  const errors = []
  if (!data.email || typeof data.email !== 'string' || !EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required.' })
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters.' })
  }
  return errors
})

// 2. Registration Validation Schema
export const validateRegister = validate((data) => {
  const errors = []
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Full name is required (min 2 characters).' })
  }
  if (!data.email || typeof data.email !== 'string' || !EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required.' })
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters.' })
  }
  if (data.phone && typeof data.phone === 'string' && !PHONE_REGEX.test(data.phone.trim())) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number.' })
  }
  return errors
})

// 3. Custom Trip Planner Validation Schema
export const validateCustomTrip = validate((data) => {
  const errors = []
  if (!data.departure && !data.fromLocation) {
    errors.push({ field: 'departure', message: 'Departure location is required.' })
  }
  if (!data.destination && (!data.toDestinations || data.toDestinations.length === 0)) {
    errors.push({ field: 'destination', message: 'At least one destination is required.' })
  }
  const email = data.email || data.contactInfo?.email
  if (!email || !EMAIL_REGEX.test(String(email).trim())) {
    errors.push({ field: 'email', message: 'A valid contact email is required.' })
  }
  const phone = data.phone || data.contactInfo?.phone
  if (!phone || !PHONE_REGEX.test(String(phone).trim())) {
    errors.push({ field: 'phone', message: 'A valid contact phone number is required.' })
  }
  return errors
})

// 4. Contact Message Validation Schema
export const validateContact = validate((data) => {
  const errors = []
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required.' })
  }
  if (!data.email || typeof data.email !== 'string' || !EMAIL_REGEX.test(data.email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required.' })
  }
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 5) {
    errors.push({ field: 'message', message: 'Message must be at least 5 characters.' })
  }
  return errors
})

export default {
  validateLogin,
  validateRegister,
  validateCustomTrip,
  validateContact,
}

