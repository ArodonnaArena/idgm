import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary is configured via the single CLOUDINARY_URL env var
// e.g. cloudinary://<api_key>:<api_secret>@<cloud_name>
cloudinary.config({
  secure: true,
})

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    if (!process.env.CLOUDINARY_URL) {
      throw new Error('CLOUDINARY_URL is not configured')
    }

    // We upload from memory buffer using upload_stream
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'idgm-products',
          resource_type: 'image',
        },
        (err, result) => {
          if (err || !result) return reject(err || new Error('Cloudinary upload failed'))
          resolve({ url: result.secure_url, publicId: result.public_id })
        },
      )

      upload.end(file.buffer)
    })
  }
}
