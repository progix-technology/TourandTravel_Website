import React, { createContext, useContext, useState, useEffect } from 'react'

export const DEFAULT_SETTINGS = {
  inquiryPhone: '+91 89532 08952',
  whatsappNumber: '+91 89532 08952',
  supportEmail: 'info@progixtechnology.com',
  emergencyHelpline: '+91 89532 08952',
  officeAddress: 'D72, Vibhuti Khand, Gomtinagar, Lucknow, UP - 226010',
  googleMapUrl: 'https://maps.google.com/?q=Vibhuti+Khand+Gomti+Nagar+Lucknow',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  twitterUrl: 'https://twitter.com',
  linkedinUrl: 'https://linkedin.com',
  announcementText: '✨ Seasonal Privilege: Flat 15% OFF on European & Himalayan Journeys — Code: LUXE15',
  showAnnouncement: true,
  conciergeHours: 'Mon – Sun: 24/7 Dedicated Private Concierge Desk'
}

export const DEFAULT_BOOKING_SETTINGS = {
  advanceDepositPct: 20,
  gstTaxRate: 18,
  cancellationHours: 48,
  autoConfirmBookings: true,
  emailAlertsOnBooking: true,
  smsAlertsOnEnquiry: true,
  customTripQuoteExpiryDays: 7
}

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('agy_site_general_settings')
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch (e) {
      return DEFAULT_SETTINGS
    }
  })

  const [bookingSettings, setBookingSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('agy_site_booking_settings')
      return saved ? { ...DEFAULT_BOOKING_SETTINGS, ...JSON.parse(saved) } : DEFAULT_BOOKING_SETTINGS
    } catch (e) {
      return DEFAULT_BOOKING_SETTINGS
    }
  })

  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('agy_site_general_settings', JSON.stringify(updated))
      return updated
    })
  }

  const updateBookingSettings = (newBookingSettings) => {
    setBookingSettings((prev) => {
      const updated = { ...prev, ...newBookingSettings }
      localStorage.setItem('agy_site_booking_settings', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        bookingSettings,
        updateBookingSettings,
        DEFAULT_SETTINGS,
        DEFAULT_BOOKING_SETTINGS
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
