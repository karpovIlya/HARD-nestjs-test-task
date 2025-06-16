import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { ITransaction, TTransactionType } from '@app/interfaces'
import { User } from '../../users/models/users.model'

@Table({ tableName: 'transactions', paranoid: true })
export class Transactions extends Model<Transactions, ITransaction> {
  @Column({
    type: DataType.ENUM('adding', 'subtraction'),
    allowNull: false,
  })
  type: TTransactionType

  @Column({
    type: DataType.DECIMAL(9, 2),
    allowNull: false,
    validate: {
      min: 10,
    },
  })
  amount: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: number

  @BelongsTo(() => User)
  user: User
}
