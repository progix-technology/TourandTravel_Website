import Blog from '../models/Blog.js'

// @desc    Get all blog posts
// @route   GET /api/v1/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    // If admin, return all. If public, return only published.
    // For simplicity, we just return all for this admin implementation
    const blogs = await Blog.find().sort('-createdAt')
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new blog post (Admin)
// @route   POST /api/v1/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    
    res.status(201).json({
      success: true,
      data: blog
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update blog post (Admin)
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      })
    }

    res.status(200).json({
      success: true,
      data: blog
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete blog post (Admin)
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      })
    }

    await Blog.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {}
    })
  } catch (error) {
    next(error)
  }
}
