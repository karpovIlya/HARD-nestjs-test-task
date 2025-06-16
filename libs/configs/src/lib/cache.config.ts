import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager'
import { createKeyv } from '@keyv/redis'
import { Keyv } from 'keyv'
import { CacheableMemory } from 'cacheable'
import { seconds } from '@app/helpers'

const getRedisUrl = (
  configService: ConfigService,
  redisHostPath?: string,
  redisPortPath?: string,
): string => {
  const host = configService.get(redisHostPath || 'REDIS_HOST')
  const port = configService.get(redisPortPath || 'REDIS_PORT')

  return `redis://${host}:${port}`
}

export const getCacheConfig = (
  redisHostPath?: string,
  redisPortPath?: string,
): CacheModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    ttl: seconds(30),
    stores: [
      new Keyv({ store: new CacheableMemory() }),
      createKeyv(getRedisUrl(configService, redisHostPath, redisPortPath)),
    ],
  }),
})
