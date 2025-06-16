import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'

interface INatsClientConfig {
  name: string
  queueNamePath?: string
  natsHostPath?: string
  natsPortPath?: string
}

export const getNatsUrl = (
  configService: ConfigService,
  natsHostPath?: string,
  natsPortPath?: string,
) => {
  const host = configService.get<string>(natsHostPath || 'NATS_HOST')
  const port = configService.get<string>(natsPortPath || 'NATS_PORT')

  return `nats://${host}:${port}`
}

export const getClientConfig = (
  config: INatsClientConfig,
): ClientsProviderAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  name: config.name,
  useFactory: (configService: ConfigService) => ({
    transport: Transport.NATS,
    options: {
      servers: [
        getNatsUrl(configService, config.natsHostPath, config.natsPortPath),
      ],
      queue: configService.get<string>(config.queueNamePath || ''),
    },
  }),
})
