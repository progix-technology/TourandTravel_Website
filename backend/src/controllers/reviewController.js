import Review from '../models/Review.js'

// @desc    Get all reviews (Admin)
// @route   GET /api/v1/reviews
// @access  Private/Admin
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name avatar email')
      .populate('tour', 'title')
      .sort('-createdAt')
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update review status (Admin)
// @route   PATCH /api/v1/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    review.status = req.body.status
    await review.save()

    res.status(200).json({
      success: true,
      data: review
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete review (Admin)
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    await Review.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {}
    })
  } catch (error) {
    next(error)
  }
}
