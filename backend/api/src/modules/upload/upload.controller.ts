import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'
import { CloudinaryService } from './cloudinary.service'

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      // Store file in memory, upload directly to Cloudinary
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File, _req: Request) {
    const { url, publicId } = await this.cloudinary.uploadImage(file)
    return { url, provider: 'cloudinary', publicId, filename: file.originalname, size: file.size, mimetype: file.mimetype }
  }
}
