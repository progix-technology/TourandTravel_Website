import nodemailer from 'nodemailer'

/**
 * Configure Nodemailer Transporter
 * Supports Gmail, Custom SMTP, Brevo, SendGrid, Mailgun, or safe development fallback
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER || process.env.EMAIL_USER
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS
  const service = process.env.SMTP_SERVICE // e.g. 'gmail'

  if (service) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
    })
  }

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  // Safe fallback transporter for local development / testing
  return null
}

/**
 * Send Booking Confirmation Email (Clean Luxury Light Theme)
 * @param {Object} booking - Booking document from MongoDB
 */
export const sendBookingConfirmationEmail = async (booking) => {
  try {
    const recipientEmail =
      booking.leadTraveler?.email ||
      booking.email ||
      booking.userEmail ||
      booking.customerEmail

    if (!recipientEmail) {
      console.log('⚠️ [Email Service] No recipient email found for booking:', booking.bookingReference)
      return { success: false, message: 'No recipient email found' }
    }

    const leadName =
      `${booking.leadTraveler?.firstName || ''} ${booking.leadTraveler?.lastName || ''}`.trim() ||
      booking.leadTraveler?.fullName ||
      'Valued Explorer'

    const tourTitle = booking.tourTitle || booking.tour?.title || 'Luxury Expedition Package'
    const bookingRef = booking.bookingReference || booking.id || 'TT-CONFIRMED'
    const totalAmount = booking.totalPrice || booking.pricing?.totalPrice || booking.amount || 0
    const currency = booking.pricing?.currency || '₹'
    const guestsCount =
      booking.guests?.total ||
      (booking.guests ? (booking.guests.adults || 0) + (booking.guests.children || 0) : null) ||
      booking.travelersCount ||
      booking.travelers ||
      1

    const departure =
      booking.travelDate ||
      (booking.dates?.startDate
        ? new Date(booking.dates.startDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Flexible Departure')

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const cleanUrl = clientUrl.includes('localhost') ? 'https://toursandtravellers.com' : clientUrl
    const fromAddress =
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      '"Tours & Travellers Concierge" <progixtechnology@gmail.com>'

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation - Tours &amp; Travellers</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F1F5F3;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F1F5F3;
      padding: 30px 15px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid #E2E8E5;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.06);
    }
    .header {
      background: #071A16;
      padding: 32px 30px 24px;
      text-align: center;
      border-bottom: 3px solid #6FCF45;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #FFFFFF;
      margin: 0;
      text-transform: uppercase;
    }
    .logo-sub {
      color: #6FCF45;
      font-size: 10.5px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      font-weight: 700;
      margin-top: 4px;
    }
    .content {
      padding: 32px 30px;
      background-color: #FFFFFF;
    }
    .badge-wrap {
      text-align: center;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      background-color: #ECFDF5;
      border: 1px solid #6FCF45;
      color: #15803D;
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 1.5px;
      padding: 6px 18px;
      border-radius: 50px;
      text-transform: uppercase;
    }
    .greeting {
      font-size: 20px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 10px;
      text-align: center;
    }
    .lead-text {
      font-size: 13.5px;
      color: #475569;
      line-height: 1.6;
      text-align: center;
      margin-bottom: 26px;
    }
    .card {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px 22px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 14px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 10px;
    }
    .btn-wrap {
      text-align: center;
      margin: 30px 0 20px;
    }
    .btn {
      display: inline-block;
      background-color: #6FCF45;
      color: #071A16 !important;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1px;
      text-decoration: none;
      padding: 14px 34px;
      border-radius: 10px;
      text-transform: uppercase;
      box-shadow: 0 4px 14px rgba(111,207,69,0.35);
    }
    .concierge-box {
      background: #F0FDF4;
      border-left: 4px solid #16A34A;
      padding: 16px;
      border-radius: 0 8px 8px 0;
      margin-top: 24px;
    }
    .concierge-title {
      font-size: 13px;
      font-weight: 700;
      color: #15803D;
      margin: 0 0 4px;
    }
    .concierge-text {
      font-size: 12px;
      color: #334155;
      margin: 0;
      line-height: 1.5;
    }
    .footer {
      background-color: #F8FAFC;
      padding: 22px;
      text-align: center;
      font-size: 11.5px;
      color: #64748B;
      border-top: 1px solid #E2E8F0;
    }
    .footer a {
      color: #15803D;
      font-weight: 600;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1 class="logo-text">TOURS &amp; TRAVELLERS</h1>
        <div class="logo-sub">Luxury Voyages &amp; Bespoke Expeditions</div>
      </div>

      <!-- Main Content (Light Theme) -->
      <div class="content">
        <div class="badge-wrap">
          <div class="badge">&#10003; EXPEDITION CONFIRMED</div>
        </div>

        <div class="greeting">Dear ${leadName},</div>
        <div class="lead-text">
          Thank you for choosing Tours &amp; Travellers. Your bespoke luxury journey has been successfully registered under VIP Reference <strong style="color: #0F172A; font-family: monospace;">${bookingRef}</strong>. Our dedicated concierge team has commenced preparing your tailored itinerary.
        </div>

        <!-- Details Card -->
        <div class="card">
          <div class="card-title">${tourTitle}</div>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 10px 0; color: #64748B; font-size: 13px;">Booking Reference</td>
              <td style="padding: 10px 0; color: #15803D; font-weight: 800; font-size: 14px; text-align: right; font-family: monospace;">${bookingRef}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 10px 0; color: #64748B; font-size: 13px;">Departure Schedule</td>
              <td style="padding: 10px 0; color: #0F172A; font-weight: 700; font-size: 13px; text-align: right;">${departure}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 10px 0; color: #64748B; font-size: 13px;">Party Size</td>
              <td style="padding: 10px 0; color: #0F172A; font-weight: 700; font-size: 13px; text-align: right;">${guestsCount} Explorer(s)</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 10px 0; color: #64748B; font-size: 13px;">Lead Traveler</td>
              <td style="padding: 10px 0; color: #0F172A; font-weight: 700; font-size: 13px; text-align: right;">${leadName} (${recipientEmail})</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 10px 0; color: #64748B; font-size: 13px;">Payment Status</td>
              <td style="padding: 10px 0; color: #15803D; font-weight: 800; font-size: 13px; text-align: right;">${booking.paymentStatus || 'Paid &amp; Secured'}</td>
            </tr>
            <tr>
              <td style="padding: 14px 0 4px; color: #0F172A; font-weight: 800; font-size: 14px;">Total Investment</td>
              <td style="padding: 14px 0 4px; color: #15803D; font-weight: 800; font-size: 18px; text-align: right;">${currency} ${Number(totalAmount).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <!-- Call to Action Button -->
        <div class="btn-wrap">
          <a href="${cleanUrl}/account/bookings" class="btn" target="_blank" style="color: #071A16;">View Booking in Portal &rarr;</a>
        </div>

        <!-- 24/7 Concierge Support Note -->
        <div class="concierge-box">
          <div class="concierge-title">&#128222; 24/7 Dedicated Concierge Support</div>
          <div class="concierge-text">
            For personal itinerary customizations, private transfers, or special requests, please connect with your designated concierge via WhatsApp at <strong>+91 89532 08952</strong> or email <strong>concierge@toursandtravellers.com</strong>.
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        &copy; ${new Date().getFullYear()} Tours &amp; Travellers Luxury Expeditions. All Rights Reserved.<br />
        Crafted with precision &bull; <a href="${cleanUrl}">Visit Website</a> &bull; <a href="${cleanUrl}/policy?tab=privacy">Privacy Policy</a>
      </div>
    </div>
  </div>
</body>
</html>
`

    const plainTextContent = `
Dear ${leadName},

Thank you for choosing Tours & Travellers. Your bespoke luxury journey has been successfully registered under VIP Reference: ${bookingRef}.

EXPEDITION DETAILS:
----------------------------------------
- Tour Package: ${tourTitle}
- Booking Reference: ${bookingRef}
- Departure Date: ${departure}
- Party Size: ${guestsCount} Explorer(s)
- Primary Explorer: ${leadName} (${recipientEmail})
- Payment Status: ${booking.paymentStatus || 'Paid & Secured'}
- Total Amount: ${currency} ${Number(totalAmount).toLocaleString('en-IN')}

24/7 DEDICATED CONCIERGE:
WhatsApp: +91 89532 08952
Email: concierge@toursandtravellers.com

Thank you for choosing Tours & Travellers Luxury Expeditions.
`

    const transporter = createTransporter()

    if (transporter) {
      const companyEmail = process.env.SMTP_USER || 'progixtechnology@gmail.com'
      const mailOptions = {
        from: fromAddress,
        replyTo: companyEmail,
        to: recipientEmail,
        subject: `Booking Confirmed: ${tourTitle} [${bookingRef}] - Tours & Travellers`,
        text: plainTextContent,
        html: htmlContent,
        headers: {
          'X-Entity-Ref-ID': bookingRef,
        },
      }

      // If customer email is different from company email, send copy/bcc to company
      if (recipientEmail.toLowerCase() !== companyEmail.toLowerCase()) {
        mailOptions.bcc = companyEmail
      }

      const info = await transporter.sendMail(mailOptions)
      console.log(`✅ [Email Service] Light-theme booking confirmation sent to ${recipientEmail} (BCC to ${companyEmail}) (ID: ${info.messageId})`)
      return { success: true, messageId: info.messageId }
    } else {
      console.log(`\n========================================================================`)
      console.log(`📨 [Email Service - Mock / Dev Mode] Light Theme Booking Email Generated`)
      console.log(`To: ${recipientEmail} (${leadName})`)
      console.log(`Subject: ✈️ Booking Confirmed: ${tourTitle} [${bookingRef}] - Tours & Travellers`)
      console.log(`Total: ₹${Number(totalAmount).toLocaleString('en-IN')} | Guests: ${guestsCount} | Date: ${departure}`)
      console.log(`========================================================================\n`)
      return { success: true, mock: true }
    }
  } catch (error) {
    console.error('❌ [Email Service Error] Failed to send booking confirmation email:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Send Booking Status Update Email (Clean Light Theme)
 */
export const sendBookingStatusUpdateEmail = async (booking, newStatus) => {
  try {
    const recipientEmail =
      booking.leadTraveler?.email ||
      booking.email ||
      booking.userEmail ||
      booking.customerEmail

    if (!recipientEmail) return

    const leadName =
      `${booking.leadTraveler?.firstName || ''} ${booking.leadTraveler?.lastName || ''}`.trim() ||
      'Valued Explorer'

    const tourTitle = booking.tourTitle || booking.tour?.title || 'Expedition Package'
    const bookingRef = booking.bookingReference || booking.id || 'TT-CONFIRMED'
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const fromAddress =
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      '"Tours & Travellers Concierge" <progixtechnology@gmail.com>'

    const transporter = createTransporter()
    if (!transporter) return

    await transporter.sendMail({
      from: fromAddress,
      to: recipientEmail,
      subject: `Update on Booking [${bookingRef}]: Status is now ${newStatus} - Tours & Travellers`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F1F5F3; padding: 30px 15px; color: #1E293B;">
          <div style="max-width: 580px; margin: auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            <div style="background: #071A16; padding: 24px; text-align: center; border-bottom: 3px solid #6FCF45;">
              <h2 style="color: #FFFFFF; margin: 0; font-size: 20px; letter-spacing: 1px;">TOURS &amp; TRAVELLERS</h2>
              <span style="color: #6FCF45; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">Status Update</span>
            </div>
            <div style="padding: 28px 24px;">
              <p style="font-size: 16px; font-weight: bold; color: #0F172A; margin-top: 0;">Dear ${leadName},</p>
              <p style="font-size: 13.5px; color: #475569; line-height: 1.6;">Your booking for <strong>${tourTitle}</strong> (Ref: <strong style="font-family: monospace; color: #15803D;">${bookingRef}</strong>) has been updated to:</p>
              <div style="display: inline-block; padding: 8px 18px; background: #ECFDF5; border: 1px solid #6FCF45; border-radius: 8px; color: #15803D; font-weight: bold; font-size: 15px; margin: 12px 0;">
                ${newStatus}
              </div>
              <p style="font-size: 13px; color: #64748B; line-height: 1.6;">You can review your updated itinerary and ticket details anytime in your explorer dashboard.</p>
              <div style="text-align: center; margin-top: 24px;">
                <a href="${clientUrl}/account/bookings" style="display: inline-block; background: #6FCF45; color: #071A16; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px; text-transform: uppercase;">Open Explorer Dashboard &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('❌ [Email Service Error] Status update email failed:', err.message)
  }
}

export default {
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
}
