import React, { useState, useEffect } from 'react'
import { Search, Mail, Phone, Calendar, Trash2, Award, User } from 'lucide-react'
import api from '../services/api'

const AdminCustomers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users')
      if (data.success) {
        setUsers(data.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const { data } = await api.delete(`/users/${id}`)
        if (data.success) {
          fetchUsers() // Refresh
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getMembershipColor = (tier) => {
    switch (tier) {
      case 'VIP Sovereign': return 'text-purple-400 bg-purple-400/10 border-purple-400/30'
      case 'Voyager Elite': return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
      default: return 'text-[#A8B5AF] bg-white/5 border-white/10'
    }
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Customer Directory</h1>
          <p className="text-sm text-[#A8B5AF] mt-1">Manage explorers and their loyalty memberships.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AF]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B241E] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6FCF45] transition-colors"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#0B241E] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-[#A8B5AF] text-xs uppercase tracking-wider border-b border-white/5">
                <th className="p-4 font-medium">Customer Profile</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Membership Tier</th>
                <th className="p-4 font-medium">Voyager Points</th>
                <th className="p-4 font-medium">Joined Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#A8B5AF]">Loading customer directory...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#A8B5AF]">No customers found matching your criteria.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#13382C] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] shrink-0 shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-[#A8B5AF] font-mono mt-0.5">ID: {user._id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[#A8B5AF]">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="text-xs">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-[#A8B5AF]">
                            <Phone className="w-3.5 h-3.5" />
                            <span className="text-xs">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getMembershipColor(user.membership)}`}>
                        {user.membership || 'Voyager Member'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#6FCF45]" />
                        <span className="font-mono text-[#6FCF45] font-bold">{user.rewardPoints || 0}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#A8B5AF]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-1.5 rounded bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-colors border border-red-400/30 ml-auto flex"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminCustomers
