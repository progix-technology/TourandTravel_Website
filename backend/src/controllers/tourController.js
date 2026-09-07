import Tour from '../models/Tour.js'

// @desc    Get all tours with optional filters
// @route   GET /api/v1/tours
// @access  Public
export const getTours = async (req, res, next) => {
  try {
    const { category, search, sort, isFeatured, destination } = req.query
    let query = {}

    if (category && category !== 'All' && category !== 'all') {
      query.category = category.toLowerCase()
    }

    if (isFeatured) {
      query.isFeatured = isFeatured === 'true'
    }

    if (destination && destination !== 'All' && destination !== 'all') {
      query.$or = [
        { destinationSlug: { $regex: destination, $options: 'i' } },
        { destination: { $regex: destination, $options: 'i' } },
        { country: { $regex: destination, $options: 'i' } },
        { title: { $regex: destination, $options: 'i' } },
        { slug: { $regex: destination, $options: 'i' } },
      ]
    }

    if (search) {
      const searchOr = [
        { title: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ]
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchOr }]
        delete query.$or
      } else {
        query.$or = searchOr
      }
    }

    let toursQuery = Tour.find(query)

    // Sorting
    if (sort === 'price_asc') {
      toursQuery = toursQuery.sort('startingPrice')
    } else if (sort === 'price_desc') {
      toursQuery = toursQuery.sort('-startingPrice')
    } else if (sort === 'rating') {
      toursQuery = toursQuery.sort('-rating')
    } else {
      toursQuery = toursQuery.sort('-createdAt')
    }

    const tours = await toursQuery

    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single tour by slug or ID
// @route   GET /api/v1/tours/:slug
// @access  Public
export const getTourBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const tour = await Tour.findOne({
      $or: [{ slug: slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
    })

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: `Tour with slug/id '${slug}' not found`,
      })
    }

    res.status(200).json({
      success: true,
      data: tour,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new tour
// @route   POST /api/v1/tours
// @access  Private/Admin
export const createTour = async (req, res, next) => {
  try {
    const tourData = { ...req.body }

    // Ensure slug
    if (!tourData.slug && tourData.title) {
      tourData.slug = tourData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    // Ensure price and startingPrice
    if (!tourData.startingPrice && tourData.price) {
      tourData.startingPrice = tourData.price
    }
    if (!tourData.price && tourData.startingPrice) {
      tourData.price = tourData.startingPrice
    }

    // Check slug uniqueness
    const existingTour = await Tour.findOne({ slug: tourData.slug })
    if (existingTour) {
      tourData.slug = `${tourData.slug}-${Date.now().toString().slice(-4)}`
    }

    const tour = await Tour.create(tourData)

    res.status(201).json({
      success: true,
      data: tour,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update tour
// @route   PUT /api/v1/tours/:id
// @access  Private/Admin
export const updateTour = async (req, res, next) => {
  try {
    let tour = await Tour.findById(req.params.id)

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: `Tour not found with id of ${req.params.id}`,
      })
    }

    const tourData = { ...req.body }
    if (tourData.price && !tourData.startingPrice) {
      tourData.startingPrice = tourData.price
    }
    if (tourData.startingPrice && !tourData.price) {
      tourData.price = tourData.startingPrice
    }

    tour = await Tour.findByIdAndUpdate(req.params.id, tourData, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: tour,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete tour
// @route   DELETE /api/v1/tours/:id
// @access  Private/Admin
export const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id)

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: `Tour not found with id of ${req.params.id}`,
      })
    }

    await Tour.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
