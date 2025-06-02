import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { IAvatar } from '@app/interfaces'
import { User } from '../../users/models/users.model'

@Table({ tableName: 'avatars' })
export class Avatar extends Model<Avatar, IAvatar> {
  @Column({
    type: DataType.STRING(128),
    unique: true,
    allowNull: false,
  })
  path: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: number

  @BelongsTo(() => User)
  user: User
}
