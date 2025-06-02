import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { NotificationGateway } from './notification.gateway'
import { TNotificationPayload } from '@app/contracts'

@Controller()
export class NotificationController {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  @EventPattern('notification.*')
  sendNotification(@Payload() payload: TNotificationPayload) {
    this.notificationGateway.sendNotification(payload)
  }
}
