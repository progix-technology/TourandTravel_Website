import React from 'react'
import { Link } from 'react-router-dom'
import { X, Shield } from 'lucide-react'
import logoImg from '../../../assets/images/logo.png'
import mountainShapeImg from '../../../assets/images/mountain_shape.png'

export const ProfileSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  activeTab,
  setActiveTab,
  user,
  conciergeWhatsApp,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-[#081C16] border-r border-white/5 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full no-scrollbar overflow-hidden">
          {/* Brand Logo Header */}
          <div className="h-20 sm:h-22 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoImg}
                alt="Logo"
                className="w-9 h-9 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                loading="lazy"
                decoding="async"
              />
              <span className="font-extrabold text-sm tracking-[0.18em] text-white uppercase font-heading leading-tight">
                TOURS <span className="text-[#6FCF45]">&amp;</span><br />TRAVELS
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1 flex-1 px-4 py-2.5 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#13382C] text-[#6FCF45] shadow-sm font-bold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#6FCF45]' : 'text-[#94A3B8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6FCF45]/20 text-[#6FCF45]">
                      {item.badge}
                    </span>
                  )}
                  {item.dot && (
                    <span className="w-2 h-2 rounded-full bg-[#6FCF45] animate-pulse" />
                  )}
                </button>
              )
            })}

            {/* Admin Switcher */}
            {user?.role === 'admin' && (
              <div className="pt-1.5">
                <Link
                  to="/admin"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 transition-all"
                >
                  <Shield className="w-4 h-4 text-amber-300" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Help Widget */}
          <div className="mt-auto px-4 pb-4 pt-1 shrink-0">
            <div className="bg-[#0C201A] border border-white/5 rounded-2xl p-4 sm:p-5 text-left relative overflow-hidden shadow-lg">
              <img
                src={mountainShapeImg}
                alt="Mountain"
                className="w-14 h-8 sm:w-16 sm:h-9 object-contain object-left mb-3.5 drop-shadow-sm"
                loading="lazy"
                decoding="async"
              />

              <h4 className="text-sm font-bold text-white mb-1 tracking-tight font-heading">
                Need Help?
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Our travel experts are just a message away.
              </p>

              <a
                href={conciergeWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 text-center transition-all active:scale-95 shadow-md tracking-tight cursor-pointer"
              >
                <span className="text-center whitespace-nowrap">WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default ProfileSidebar

