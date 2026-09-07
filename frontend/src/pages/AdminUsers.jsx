import React, { useState, useEffect } from 'react'
import { Search, Mail, Shield, User as UserIcon, Calendar, Lock } from 'lucide-react'
import api from '../services/api'

const AdminUsers = () => {
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

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'concierge': return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
      default: return 'text-[#6FCF45] bg-[#6FCF45]/10 border-[#6FCF45]/30'
    }
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Users &amp; Roles</h1>
          <p className="text-sm text-[#A8B5AF] mt-1">Manage platform users and access control (Role assignment is currently disabled).</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AF]" />
          <input
            type="text"
            placeholder="Search users..."
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
                <th className="p-4 font-medium">User Account</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Current Role</th>
                <th className="p-4 font-medium">Joined Date</th>
                <th className="p-4 font-medium text-right">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#A8B5AF]">Loading user directory...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#A8B5AF]">No users found matching your criteria.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#13382C] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] shrink-0 shadow-sm">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-[#A8B5AF] font-mono mt-0.5">ID: {user._id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-[#A8B5AF]">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs">{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getRoleColor(user.role)}`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="p-4 text-[#A8B5AF]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {user.role === 'admin' ? (
                        <div className="inline-flex items-center gap-1.5 text-xs text-[#A8B5AF] bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 opacity-70 cursor-not-allowed">
                          <Lock className="w-3 h-3" />
                          <span>Fixed Role</span>
                        </div>
                      ) : (
                        <select
                          disabled
                          className="bg-[#13151A] border border-white/10 text-[#A8B5AF] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#6FCF45] cursor-not-allowed opacity-70"
                          defaultValue={user.role || 'user'}
                        >
                          <option value="user">User</option>
                          <option value="concierge">Concierge</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
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

export default AdminUsers
