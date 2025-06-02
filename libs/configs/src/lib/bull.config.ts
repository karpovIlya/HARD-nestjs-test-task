import { ConfigModule, ConfigService } from '@nestjs/config'
import { SharedBullAsyncConfiguration } from '@nestjs/bullmq'

export const getBullConfig = (
  redisHostPath?: string,
  redisPortPath?: string,
): SharedBullAsyncConfiguration => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    connection: {
      host: configService.get(redisHostPath || 'REDIS_HOST'),
      port: +configService.get(redisPortPath || 'REDIS_PORT'),
    },
    prefix: 'queue',
  }),
})
