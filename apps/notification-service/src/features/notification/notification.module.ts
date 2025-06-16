import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from '@app/configs'
import { NotificationController } from './notification.controller'
import { NotificationGateway } from './notification.gateway'

@Module({
  imports: [JwtModule.registerAsync(getJwtConfig())],
  controllers: [NotificationController],
  providers: [NotificationGateway],
})
export class NotificationModule {}
