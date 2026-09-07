import Destination from '../models/Destination.js'

// @desc    Get all destinations
// @route   GET /api/v1/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const { region, search, isPopular } = req.query
    let query = {}

    if (region && region !== 'All' && region !== 'all') {
      query.region = { $regex: region, $options: 'i' }
    }

    if (isPopular) {
      query.isPopular = isPopular === 'true'
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } },
      ]
    }

    const destinations = await Destination.find(query).sort('-rating')

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single destination by slug
// @route   GET /api/v1/destinations/:slug
// @access  Public
export const getDestinationBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const destination = await Destination.findOne({
      $or: [{ slug: slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
    })

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: `Destination with slug '${slug}' not found`,
      })
    }

    res.status(200).json({
      success: true,
      data: destination,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new destination
// @route   POST /api/v1/destinations
// @access  Private/Admin
export const createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body)

    res.status(201).json({
      success: true,
      data: destination,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update destination
// @route   PUT /api/v1/destinations/:id
// @access  Private/Admin
export const updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id)

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: `Destination not found with id of ${req.params.id}`,
      })
    }

    destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: destination,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete destination
// @route   DELETE /api/v1/destinations/:id
// @access  Private/Admin
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id)

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: `Destination not found with id of ${req.params.id}`,
      })
    }

    await Destination.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
