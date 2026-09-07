import React, { useState, useEffect } from 'react'
import { Search, Plus, Eye, Edit, Trash2, Calendar, FileText } from 'lucide-react'
import api from '../services/api'

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs')
      if (data.success) {
        setBlogs(data.data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const { data } = await api.delete(`/blogs/${id}`)
        if (data.success) {
          fetchBlogs()
        }
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 max-w-[1400px] mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Journal & Blog</h1>
          <p className="text-sm text-[#A8B5AF] mt-1">Manage articles, stories, and travel guides.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AF]" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B241E] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6FCF45] transition-colors"
            />
          </div>
          <button className="w-full sm:w-auto px-4 py-2.5 bg-[#6FCF45] text-[#071A16] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#7AE54F] transition-colors">
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </div>

      <div className="bg-[#0B241E] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-[#A8B5AF] text-xs uppercase tracking-wider border-b border-white/5">
                <th className="p-4 font-medium">Post Title</th>
                <th className="p-4 font-medium">Author</th>
                <th className="p-4 font-medium">Date Created</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#A8B5AF]">Loading journal posts...</td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#A8B5AF]">No posts found.</td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                          <FileText className="w-5 h-5 text-[#A8B5AF]" />
                        </div>
                        <div>
                          <p className="font-medium text-white max-w-xs truncate" title={blog.title}>{blog.title}</p>
                          <p className="text-xs text-[#A8B5AF] mt-0.5 truncate max-w-xs font-mono">/{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#A8B5AF]">
                      {blog.author}
                    </td>
                    <td className="p-4 text-[#A8B5AF]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${
                        blog.published 
                          ? 'text-[#6FCF45] bg-[#6FCF45]/10 border-[#6FCF45]/30' 
                          : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-1.5 rounded bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10"
                          title="Preview Post"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-[#071A16] transition-colors border border-blue-400/30"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBlog(blog._id)}
                          className="p-1.5 rounded bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-colors border border-red-400/30"
                          title="Delete Post"
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

export default AdminBlog
