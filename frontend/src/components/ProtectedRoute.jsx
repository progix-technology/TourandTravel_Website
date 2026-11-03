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
    // If route requires admin, redirect to dedicated /admin/login; else customer /login
    const redirectTarget = requireAdmin ? '/admin/login' : '/login'
    return <Navigate to={redirectTarget} state={{ from: location }} replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    // If the route requires admin and the user is not an admin, redirect them to admin login
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
