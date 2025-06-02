import { Module, forwardRef } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { SequelizeModule } from '@nestjs/sequelize'
import { BullModule } from '@nestjs/bullmq'
import { getClientConfig } from '@app/configs'

import { UsersModule } from '../users/users.module'
import { AuthModule } from '../auth/auth.module'

import { BalanceController } from './balance.controller'
import { BalanceService } from './balance.service'
import { BalanceRepository } from './repositories/balance.repository'
import { BalanceProducer } from './producers/balance.producer'
import { BalanceProcessor } from './processors/balance.processor'
import { TransactionRepository } from './repositories/transaction.repository'

import { Transactions } from './models/transactions.model'

@Module({
  imports: [
    ClientsModule.registerAsync([
      getClientConfig({
        name: 'USER_SERVICE',
        queueNamePath: 'NATS_NOTIFICATION_QUEUE',
      }),
    ]),
    SequelizeModule.forFeature([Transactions]),
    BullModule.registerQueue({
      name: 'balance',
    }),
    forwardRef(() => UsersModule),
    AuthModule,
  ],
  controllers: [BalanceController],
  providers: [
    BalanceService,
    BalanceRepository,
    TransactionRepository,
    BalanceProducer,
    BalanceProcessor,
  ],
  exports: [TransactionRepository],
})
export class BalanceModule {}
