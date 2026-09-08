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

    const preset = process.env.CLOUDINARY_UPLOAD_PRESET || 'Tourandtraveller'
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dbp97xecb'

    // 1. Try unsigned upload using preset (Fastest & avoids API secret expiry issues)
    if (preset && cloudName) {
      try {
        result = await cloudinary.uploader.unsigned_upload(dataURI, preset, {
          cloud_name: cloudName,
          folder: 'tours-and-travellers',
        })
      } catch (unsignedError) {
        console.warn('Unsigned upload failed, attempting signed upload:', unsignedError.message)
        if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
          result = await cloudinary.uploader.upload(dataURI, {
            folder: 'tours-and-travellers',
            resource_type: 'auto',
          })
        } else {
          throw unsignedError
        }
      }
    } else if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      result = await cloudinary.uploader.upload(dataURI, {
        folder: 'tours-and-travellers',
        resource_type: 'auto',
      })
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
