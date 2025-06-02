import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { AppExceptionFilter } from '@app/filters'
import { getNatsUrl } from '@app/configs'

async function startServer() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [getNatsUrl(configService)],
      queue: configService.get<string>('NATS_NOTIFICATION_QUEUE'),
    },
  })

  app.useGlobalFilters(new AppExceptionFilter())

  await app.startAllMicroservices()
  await app.listen(configService.get<number>('NOTIFY_PORT') || 8080)
}

startServer()
