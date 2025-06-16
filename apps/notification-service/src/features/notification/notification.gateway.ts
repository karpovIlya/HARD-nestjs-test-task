import { Logger } from '@nestjs/common'
import {
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { IJwtPayload } from '@app/interfaces'
import { TNotificationPayload } from '@app/contracts'

@WebSocketGateway({ namespace: 'notification' })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() websocketServer: Server
  private readonly logger = new Logger(NotificationGateway.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit() {
    this.logger.log('🚀 WebSocket server initialized')
  }

  handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization

      if (!authHeader) {
        this.logger.warn(
          `⚠️ Client ${client.id} tried to connect without auth header`,
        )
        client.disconnect(true)
        return
      }

      const { id: userId } = this.jwtService.verify<IJwtPayload>(authHeader, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      })

      this.logger.log(`✅ Client connected: ${client.id}`)
      client.join(userId.toString())
    } catch (error) {
      this.logger.error(`❌ Error during connection: ${error.message}`)
      client.disconnect(true)
      return
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Client disconnected: ${client.id}`)
  }

  sendNotification(payload: TNotificationPayload) {
    switch (payload.eventType) {
      case 'updated-balance':
        this.websocketServer
          .to(payload.userId.toString())
          .emit('notification', payload)
        break
      default:
        this.logger.warn('⚠️ Unknown event type received')
        break
    }

    this.logger.log('📢 Notification sent')
  }
}
