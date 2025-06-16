import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModuleAsyncOptions } from '@nestjs/jwt'

export const getJwtConfig = (
  jwtAccessSecret?: string,
  jwtAccessExpiresIn?: string,
): JwtModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>(jwtAccessSecret || 'JWT_ACCESS_SECRET'),
    signOptions: {
      expiresIn: configService.get<string>(
        jwtAccessExpiresIn || 'JWT_ACCESS_EXPIRES_IN',
      ),
    },
  }),
})
