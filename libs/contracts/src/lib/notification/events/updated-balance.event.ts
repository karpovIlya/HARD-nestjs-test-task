import { IBaseEvent } from '@app/interfaces'
import { ITransaction } from '@app/interfaces/lib/transaction.interface'

export interface IUpdatedBalancePayload extends ITransaction {
  eventType: 'updated-balance'
}

export class UpdatedBalanceEvent implements IBaseEvent<IUpdatedBalancePayload> {
  readonly subject = 'notification.updated-balance'
  readonly payload: IUpdatedBalancePayload

  constructor(transaction: ITransaction) {
    this.payload = {
      ...transaction,
      eventType: 'updated-balance',
    }
  }
}
