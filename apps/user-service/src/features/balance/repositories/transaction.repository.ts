import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Transaction } from 'sequelize'
import { ITransaction } from '@app/interfaces'

import { TransactionEntity } from '../entities/transaction.entity'
import { Transactions } from '../models/transactions.model'

@Injectable()
export class TransactionRepository {
  private readonly logger = new Logger(TransactionRepository.name)

  constructor(
    @InjectModel(Transactions)
    private readonly transactionData: typeof Transactions,
  ) {}

  public async createTransaction(
    creatingTransaction: ITransaction,
    transaction?: Transaction,
  ): Promise<TransactionEntity> {
    this.logger.log('🔍 Beginning of creating transaction')

    const operation = await this.transactionData.create(creatingTransaction, {
      transaction,
    })

    this.logger.log('✅ Adding transaction was successful')

    return new TransactionEntity(operation.toJSON())
  }

  public async createManyTransactions(
    creatingTransactions: ITransaction[],
    transaction?: Transaction,
  ): Promise<TransactionEntity[]> {
    this.logger.log('🔍 Beginning of creating a lot of transactions')

    const operations = await this.transactionData.bulkCreate(
      creatingTransactions,
      { transaction },
    )

    this.logger.log('✅ Adding a lot of transactions was successful')

    return operations.map(
      (transaction) => new TransactionEntity(transaction.toJSON()),
    )
  }

  public async destroyTransaction(id: number) {
    this.logger.log('🔍 Beginning of destroying transaction')

    await this.transactionData.destroy({ where: { id } })

    this.logger.log('✅ Destroying transaction was successful')
  }

  public async destroyAllUserTransactions(userId: number) {
    this.logger.log('🔍 Beginning of destroying users transactions')

    await this.transactionData.destroy({ where: { userId } })

    this.logger.log('✅ Destroying users transaction was successful')
  }

  public async getUserTransactionsCount(userId: number) {
    this.logger.log('🔍 Beginning of getting transaction count')

    const transactionsCount = await this.transactionData.count({
      where: { userId },
    })

    this.logger.log('✅ Getting transaction count was successful')

    return transactionsCount
  }

  public async getPaginatedUserTransactions(
    userId: number,
    limit: number,
    offset: number,
  ) {
    this.logger.log('🔍 Beginning of getting paginated transactions')

    const paginatedTransactions = await this.transactionData.findAndCountAll({
      where: { userId },
      offset,
      limit,
    })

    this.logger.log('✅ Getting paginated transactions was successful')

    return paginatedTransactions.rows.map(
      (transaction) => new TransactionEntity(transaction.toJSON()),
    )
  }
}
