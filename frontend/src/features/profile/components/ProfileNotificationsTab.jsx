import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Trash2, Briefcase, Sparkles, Bell, ArrowRight, X } from 'lucide-react'

export const ProfileNotificationsTab = ({
  allNotifications,
  unreadNotificationsCount,
  markAllNotificationsAsRead,
  clearAllNotifications,
  notificationFilter,
  setNotificationFilter,
  filteredNotifications,
  readNotificationIds,
  markNotificationAsRead,
  clearNotification,
  setActiveTab,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Notifications &amp; Activity
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Real-time alerts regarding your bookings, custom quotes, and travel updates.
          </p>
        </div>

        {allNotifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-[#6FCF45]" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={clearAllNotifications}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto">
        <button
          onClick={() => setNotificationFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            notificationFilter === 'all'
              ? 'bg-[#6FCF45] text-[#071A16]'
              : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
          }`}
        >
          All ({allNotifications.length})
        </button>
        <button
          onClick={() => setNotificationFilter('bookings')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            notificationFilter === 'bookings'
              ? 'bg-[#6FCF45] text-[#071A16]'
              : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Expeditions ({allNotifications.filter((n) => n.category === 'bookings').length})</span>
        </button>
        <button
          onClick={() => setNotificationFilter('system')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            notificationFilter === 'system'
              ? 'bg-[#6FCF45] text-[#071A16]'
              : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Club &amp; System ({allNotifications.filter((n) => n.category === 'system').length})</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => {
            const isUnread = !readNotificationIds.includes(item.id)
            const IconComponent = item.icon || Bell
            return (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`bg-[#081C16] border rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer ${
                  isUnread ? 'border-[#6FCF45]/40 bg-[#0A241C]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnread ? 'bg-[#6FCF45]/15 text-[#6FCF45]' : 'bg-white/5 text-[#94A3B8]'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#6FCF45]" />
                      )}
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 text-[#94A3B8]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-[#94A3B8]/60 mt-1.5 block">
                      {new Date(item.time).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0" onClick={(e) => e.stopPropagation()}>
                  {item.linkTab && (
                    <button
                      onClick={() => {
                        markNotificationAsRead(item.id)
                        setActiveTab(item.linkTab)
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.actionText || 'View Details'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => clearNotification(item.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    title="Dismiss Notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-[#081C16] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#94A3B8] mb-4">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 font-heading">
              No Notifications Yet
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed mb-5">
              You are all caught up! Real-time alerts regarding your bookings, custom quotations, and promotional concierge offers will appear here.
            </p>
            <Link
              to="/tours"
              className="px-5 py-2.5 rounded-xl bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] text-xs font-bold uppercase tracking-wider transition-all"
            >
              Browse Tours
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileNotificationsTab

