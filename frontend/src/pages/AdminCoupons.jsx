import React, { useState, useEffect } from 'react'
import { Search, Plus, Tag, Calendar, Percent, DollarSign, Trash2, Edit, Power } from 'lucide-react'
import api from '../services/api'

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons')
      if (data.success) {
        setCoupons(data.data)
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { data } = await api.patch(`/coupons/${id}/status`, { isActive: !currentStatus })
      if (data.success) {
        fetchCoupons()
      }
    } catch (error) {
      console.error('Error toggling coupon status:', error)
    }
  }

  const deleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const { data } = await api.delete(`/coupons/${id}`)
        if (data.success) {
          fetchCoupons()
        }
      } catch (error) {
        console.error('Error deleting coupon:', error)
      }
    }
  }

  const filteredCoupons = coupons.filter(
    (c) => c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 max-w-[1400px] mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Promo Codes & Coupons</h1>
          <p className="text-sm text-[#A8B5AF] mt-1">Manage discounts and promotional campaigns.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AF]" />
            <input
              type="text"
              placeholder="Search code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B241E] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6FCF45] transition-colors"
            />
          </div>
          <button className="w-full sm:w-auto px-4 py-2.5 bg-[#6FCF45] text-[#071A16] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#7AE54F] transition-colors">
            <Plus className="w-4 h-4" />
            New Coupon
          </button>
        </div>
      </div>

      <div className="bg-[#0B241E] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-[#A8B5AF] text-xs uppercase tracking-wider border-b border-white/5">
                <th className="p-4 font-medium">Coupon Code</th>
                <th className="p-4 font-medium">Discount Value</th>
                <th className="p-4 font-medium">Usage</th>
                <th className="p-4 font-medium">Expiry Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#A8B5AF]">Loading coupons...</td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#A8B5AF]">No coupons found.</td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#6FCF45]" />
                        <span className="font-mono text-white font-bold text-base tracking-wider">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        {coupon.discountType === 'Percentage' ? (
                          <><Percent className="w-4 h-4 text-[#A8B5AF]" /> {coupon.discountValue}%</>
                        ) : (
                          <><DollarSign className="w-4 h-4 text-[#A8B5AF]" /> ${coupon.discountValue}</>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-[#A8B5AF]">
                      <span className="font-medium text-white">{coupon.usedCount}</span> / {coupon.usageLimit}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-[#A8B5AF]">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${
                        coupon.isActive 
                          ? 'text-[#6FCF45] bg-[#6FCF45]/10 border-[#6FCF45]/30' 
                          : 'text-red-400 bg-red-400/10 border-red-400/30'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(coupon._id, coupon.isActive)}
                          className={`p-1.5 rounded transition-colors border ${
                            coupon.isActive 
                              ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400 hover:text-[#071A16] border-yellow-400/30' 
                              : 'bg-[#6FCF45]/10 text-[#6FCF45] hover:bg-[#6FCF45] hover:text-[#071A16] border-[#6FCF45]/30'
                          }`}
                          title={coupon.isActive ? "Deactivate" : "Activate"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-[#071A16] transition-colors border border-blue-400/30"
                          title="Edit Coupon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon._id)}
                          className="p-1.5 rounded bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-colors border border-red-400/30"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

export default AdminCoupons
