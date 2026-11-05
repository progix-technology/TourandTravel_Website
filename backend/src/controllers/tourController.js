import Tour from '../models/Tour.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Get all tours with optional filters
// @route   GET /api/v1/tours
// @access  Public
export const getTours = asyncHandler(async (req, res) => {
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
})

// @desc    Get single tour by slug or ID
// @route   GET /api/v1/tours/:slug
// @access  Public
export const getTourBySlug = asyncHandler(async (req, res) => {
  const rawSlug = req.params.slug || ''
  const cleanSlug = decodeURIComponent(rawSlug).trim()
  const hyphenSlug = cleanSlug.replace(/\s+/g, '-')

  const isObjectId = cleanSlug.match(/^[0-9a-fA-F]{24}$/)

  // 1. Direct Match by exact slug or ObjectId
  let tour = await Tour.findOne({
    $or: [
      { slug: cleanSlug },
      { slug: hyphenSlug },
      { _id: isObjectId ? cleanSlug : null },
    ],
  })

  // 2. Fallback Match by destinationSlug or destination regex
  if (!tour) {
    tour = await Tour.findOne({
      $or: [
        { destinationSlug: cleanSlug.toLowerCase() },
        { destinationSlug: hyphenSlug.toLowerCase() },
        { destination: { $regex: cleanSlug, $options: 'i' } },
        { title: { $regex: cleanSlug, $options: 'i' } },
      ],
    })
  }

  // 3. Fallback partial title or slug match
  if (!tour) {
    tour = await Tour.findOne({
      $or: [
        { slug: { $regex: cleanSlug, $options: 'i' } },
        { title: { $regex: cleanSlug.replace(/-/g, ' '), $options: 'i' } },
      ],
    })
  }

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: `Tour with identifier '${cleanSlug}' not found`,
    })
  }

  res.status(200).json({
    success: true,
    data: tour,
  })
})

// @desc    Create new tour
// @route   POST /api/v1/tours
// @access  Private/Admin
export const createTour = asyncHandler(async (req, res) => {
  const tourData = { ...req.body }

  // Ensure slug
  if (!tourData.slug && tourData.title) {
    tourData.slug = tourData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Ensure destinationSlug
  if (!tourData.destinationSlug && tourData.destination) {
    tourData.destinationSlug = tourData.destination
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

  // Ensure isFeatured defaults to true for new admin expeditions
  if (tourData.isFeatured === undefined) {
    tourData.isFeatured = true
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
})

// @desc    Update tour
// @route   PUT /api/v1/tours/:id
// @access  Private/Admin
export const updateTour = asyncHandler(async (req, res) => {
  const idParam = req.params.id || ''
  const cleanId = decodeURIComponent(idParam).trim()
  const isObjectId = cleanId.match(/^[0-9a-fA-F]{24}$/)

  let tour = isObjectId ? await Tour.findById(cleanId) : null
  if (!tour) {
    tour = await Tour.findOne({
      $or: [
        { slug: cleanId },
        { slug: cleanId.toLowerCase() },
        { destinationSlug: cleanId.toLowerCase() },
        { title: { $regex: `^${cleanId}$`, $options: 'i' } },
      ],
    })
  }

  const tourData = { ...req.body }
  if (tourData.price && !tourData.startingPrice) {
    tourData.startingPrice = tourData.price
  }
  if (tourData.startingPrice && !tourData.price) {
    tourData.price = tourData.startingPrice
  }
  if (!tourData.destinationSlug && tourData.destination) {
    tourData.destinationSlug = tourData.destination
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (tour) {
    tour = await Tour.findByIdAndUpdate(tour._id, tourData, {
      new: true,
      runValidators: true,
    })
  } else {
    // Upsert: Create if it originated from mockData
    if (!tourData.slug) {
      tourData.slug = cleanId
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    tour = await Tour.create(tourData)
  }

  res.status(200).json({
    success: true,
    data: tour,
  })
})

// @desc    Delete tour
// @route   DELETE /api/v1/tours/:id
// @access  Private/Admin
export const deleteTour = asyncHandler(async (req, res) => {
  const idParam = req.params.id || ''
  const cleanId = decodeURIComponent(idParam).trim()
  const isObjectId = cleanId.match(/^[0-9a-fA-F]{24}$/)

  let tour = isObjectId ? await Tour.findById(cleanId) : null
  if (!tour) {
    tour = await Tour.findOne({
      $or: [
        { slug: cleanId },
        { slug: cleanId.toLowerCase() },
      ],
    })
  }

  if (tour) {
    await Tour.findByIdAndDelete(tour._id)
  }

  res.status(200).json({
    success: true,
    data: {},
  })
})
