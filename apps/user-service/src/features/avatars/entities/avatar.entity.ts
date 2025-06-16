import { IAvatar } from '@app/interfaces'

export class AvatarEntity implements IAvatar {
  id?: number
  userId: number
  path: string
  createdAt?: string
  updatedAt?: string

  constructor(avatar: IAvatar) {
    this.id = avatar.id
    this.userId = avatar.userId
    this.path = avatar.path
    this.createdAt = avatar.createdAt
    this.updatedAt = avatar.updatedAt
  }
}
