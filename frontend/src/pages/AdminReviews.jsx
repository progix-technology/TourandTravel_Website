import React, { useState, useEffect } from 'react'
import { Search, Star, MessageCircle, User, Check, X, Trash2 } from 'lucide-react'
import api from '../services/api'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews')
      if (data.success) {
        setReviews(data.data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/reviews/${id}/status`, { status })
      if (data.success) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Error updating review status:', error)
    }
  }

  const deleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const { data } = await api.delete(`/reviews/${id}`)
        if (data.success) {
          fetchReviews()
        }
      } catch (error) {
        console.error('Error deleting review:', error)
      }
    }
  }

  const filteredReviews = reviews.filter(
    (r) =>
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`w-3.5 h-3.5 ${
          idx < rating ? 'text-[#6FCF45] fill-[#6FCF45]' : 'text-white/20'
        }`}
      />
    ))
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Customer Reviews</h1>
          <p className="text-sm text-[#A8B5AF] mt-1">Moderate and manage traveler feedback.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AF]" />
          <input
            type="text"
            placeholder="Search reviews or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0B241E] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6FCF45] transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#0B241E] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-[#A8B5AF] text-xs uppercase tracking-wider border-b border-white/5">
                <th className="p-4 font-medium">Author</th>
                <th className="p-4 font-medium">Tour/Expedition</th>
                <th className="p-4 font-medium">Rating & Comment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#A8B5AF]">Loading reviews...</td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#A8B5AF]">No reviews found.</td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#13382C] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] shrink-0 shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{review.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-[#A8B5AF] mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#A8B5AF] text-xs">
                      {review.tour?.title || 'General Review'}
                    </td>
                    <td className="p-4 max-w-md">
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-[#A8B5AF] text-xs line-clamp-2 italic" title={review.comment}>
                        "{review.comment}"
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${
                        review.status === 'Approved' ? 'text-[#6FCF45] bg-[#6FCF45]/10 border-[#6FCF45]/30' :
                        review.status === 'Rejected' ? 'text-red-400 bg-red-400/10 border-red-400/30' :
                        'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== 'Approved' && (
                          <button
                            onClick={() => updateStatus(review._id, 'Approved')}
                            className="p-1.5 rounded bg-[#6FCF45]/10 text-[#6FCF45] hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors border border-[#6FCF45]/30"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {review.status !== 'Rejected' && (
                          <button
                            onClick={() => updateStatus(review._id, 'Rejected')}
                            className="p-1.5 rounded bg-orange-400/10 text-orange-400 hover:bg-orange-400 hover:text-[#071A16] transition-colors border border-orange-400/30"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteReview(review._id)}
                          className="p-1.5 rounded bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-colors border border-red-400/30"
                          title="Delete"
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

export default AdminReviews
