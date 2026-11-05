import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, Bell, Crown, ChevronDown, User, Shield, LogOut } from 'lucide-react'

export const ProfileHeader = ({
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  setActiveTab,
  unreadNotificationsCount,
  userDropdownOpen,
  setUserDropdownOpen,
  user,
  memberRole,
  currentPoints,
  logout,
}) => {
  return (
    <header className="h-20 sm:h-22 px-6 sm:px-10 border-b border-white/5 bg-[#081C16]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-6 shrink-0">
      {/* Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl sm:max-w-2xl">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/5 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations, packages..."
            className="w-full bg-[#0B241E] border border-white/10 rounded-2xl pl-11 sm:pl-12 pr-4 sm:pr-5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-[#94A3B8]/70 focus:outline-none focus:border-[#6FCF45]/50 transition-colors shadow-inner"
          />
        </form>
      </div>

      {/* Notifications & Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          onClick={() => setActiveTab('notifications')}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#0B241E] border border-white/10 flex items-center justify-center text-white/80 hover:text-white relative hover:bg-white/5 transition-all cursor-pointer shadow-sm"
          title="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#6FCF45] text-[#071A16] font-black text-[10px] flex items-center justify-center absolute -top-1 -right-1 shadow-[0_0_10px_#6FCF45] border-2 border-[#0B241E] animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 sm:gap-3 p-1.5 sm:pr-3 rounded-2xl hover:bg-white/5 border border-white/5 transition-all cursor-pointer bg-[#0B241E]/50"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#13382C] to-[#6FCF45] text-[#071A16] flex items-center justify-center font-extrabold text-sm shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">
                {user?.name || 'Explorer'}
              </div>
              <div className="text-[10px] text-[#6FCF45] font-semibold flex items-center gap-1 mt-0.5">
                <Crown className="w-2.5 h-2.5 fill-current" />
                <span>{memberRole}</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-white/50" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0B241E] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-white/5">
                <div className="text-xs font-bold text-white">{user?.name}</div>
                <div className="text-[10px] text-[#94A3B8] truncate">{user?.email}</div>
                <div className="mt-1 text-[10px] text-[#6FCF45] font-bold">
                  {currentPoints} Loyalty Points
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('profile')
                  setUserDropdownOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-xs text-[#94A3B8] hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile Settings</span>
              </button>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="w-full px-4 py-2 text-left text-xs text-amber-300 hover:bg-white/5 flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <div className="border-t border-white/5 my-1" />
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default ProfileHeader

