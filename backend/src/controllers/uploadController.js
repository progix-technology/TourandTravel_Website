import cloudinary from '../config/cloudinary.js'

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    // Convert buffer to base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataURI = `data:${req.file.mimetype};base64,${b64}`

    let result

    // 1. First priority: Signed upload using API Secret
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      result = await cloudinary.uploader.upload(dataURI, {
        folder: 'tours-and-travellers',
        resource_type: 'auto',
      })
    } else if (process.env.CLOUDINARY_UPLOAD_PRESET) {
      // 2. Second priority: Unsigned upload via preset
      result = await cloudinary.uploader.unsigned_upload(
        dataURI,
        process.env.CLOUDINARY_UPLOAD_PRESET,
        {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          folder: 'tours-and-travellers',
        }
      )
    } else {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary credentials (API Key & Secret or Preset) not configured',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    })
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during Cloudinary upload',
      details: error,
    })
  }
}
