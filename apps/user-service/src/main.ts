import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { AppExceptionFilter } from '@app/filters'

async function startServer() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'

  app.setGlobalPrefix(globalPrefix)
  app.use(cookieParser())
  app.useGlobalFilters(new AppExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('TEST-TASK API - User Service')
    .setDescription(
      'API for user registration, authentication with JWT, and user management',
    )
    .addTag('API')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)
}

startServer()
