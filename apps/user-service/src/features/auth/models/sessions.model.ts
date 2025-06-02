import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { ISession } from '@app/interfaces'
import { User } from '../../users/models/users.model'

@Table({ tableName: 'sessions' })
export class Session extends Model<Session, ISession> {
  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: false,
  })
  refreshToken: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: number

  @BelongsTo(() => User)
  user: User
}
