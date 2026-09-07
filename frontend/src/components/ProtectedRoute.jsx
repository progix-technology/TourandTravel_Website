import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071A16] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6FCF45] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    // If the route requires admin and the user is not an admin, redirect them
    return <Navigate to="/account" replace />
  }

  return children
}

export default ProtectedRoute
