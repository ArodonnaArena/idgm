import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as path from 'path'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [/localhost:\d+$/, 'https://idgm-web.vercel.app', /\.vercel\.app$/],
      credentials: true
    }
  })
  // When running behind a proxy (Render, Heroku, etc.), trust the proxy so
  // `req.protocol` reflects the original protocol (x-forwarded-proto).
  // This is important to generate correct https image URLs when behind TLS
  // termination.
  app.set('trust proxy', true)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
  await app.listen(process.env.PORT || 4000)
}
bootstrap()
