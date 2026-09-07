import Media from '../models/Media.js'
import { ALL_GALLERY_PHOTOS } from '../seed/galleryMediaData.js'

// @desc    Get all media items (Public / Admin)
// @route   GET /api/v1/media
// @access  Public
export const getMedia = async (req, res, next) => {
  try {
    // Auto-seed all 74 photos if collection is empty or has only the initial 15
    const totalCount = await Media.countDocuments()
    if (totalCount < 50) {
      if (totalCount > 0) {
        await Media.deleteMany({})
      }
      await Media.insertMany(ALL_GALLERY_PHOTOS)
    }

    const { category, search, fileType } = req.query
    let query = {}

    if (category && category !== 'ALL') {
      if (category === 'INDIA') {
        query.location = { $regex: /india/i }
      } else if (category === 'INTERNATIONAL') {
        query.location = { $not: /india/i }
      } else {
        query.category = { $regex: new RegExp(category, 'i') }
      }
    }

    if (fileType && fileType !== 'All') {
      query.fileType = fileType
    }

    if (search) {
      query.$or = [
        { filename: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }

    const media = await Media.find(query).sort('-createdAt')

    res.status(200).json({
      success: true,
      count: media.length,
      data: media
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload/Create new media record (Admin)
// @route   POST /api/v1/media
// @access  Private/Admin
export const createMedia = async (req, res, next) => {
  try {
    const rawBody = req.body
    const filename = rawBody.filename || 'media-asset.jpg'
    const cleanTitle = rawBody.title || filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')

    const media = await Media.create({
      filename,
      title: cleanTitle,
      category: rawBody.category || 'Mountains & Alpine',
      location: rawBody.location || 'Global Expedition Sanctuary',
      url: rawBody.url,
      fileType: rawBody.fileType || 'Image',
      size: rawBody.size || '1.5 MB',
      uploadedBy: req.user?._id
    })

    res.status(201).json({
      success: true,
      data: media
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update media item (Admin)
// @route   PUT /api/v1/media/:id
// @access  Private/Admin
export const updateMedia = async (req, res, next) => {
  try {
    let media = await Media.findById(req.params.id)

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found'
      })
    }

    media = await Media.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      data: media
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete media item (Admin)
// @route   DELETE /api/v1/media/:id
// @access  Private/Admin
export const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id)

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media item not found'
      })
    }

    await Media.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {}
    })
  } catch (error) {
    next(error)
  }
}
