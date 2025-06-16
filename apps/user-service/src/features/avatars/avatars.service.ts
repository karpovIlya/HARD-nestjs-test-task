import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ERROR_MESSAGES } from '@app/consts'

import { IFileService } from '../../providers/files/files.adapter'

import { AvatarsRepository } from './repositories/avatars.repository'
import { AvatarDto, GetAvatarsResultDto } from './dto/get-avatars-result.dto'

import { UploadFileResultDto } from '../../providers/files/s3/dto/upload-file-result.dto'

@Injectable()
export class AvatarsService {
  private readonly logger = new Logger(AvatarsService.name)
  private readonly MAX_AVATARS_COUNT = 5

  constructor(
    private readonly filesService: IFileService,
    private readonly avatarsRepository: AvatarsRepository,
  ) {}

  public async getUserAvatars(userId: number): Promise<GetAvatarsResultDto> {
    this.logger.log('🔍 Beginning of getting user avatars')

    const avatars = await this.avatarsRepository.getUserAvatars(userId)

    this.logger.log('✅ Getting user avatars was successful')

    return { avatars }
  }

  public async createAvatar(
    userId: number,
    avatarFile: Express.Multer.File,
  ): Promise<UploadFileResultDto> {
    this.logger.log('🔍 Beginning of creating avatar')

    const countUserAvatars =
      await this.avatarsRepository.countUserAvatars(userId)

    if (countUserAvatars >= this.MAX_AVATARS_COUNT) {
      this.logger.error('❌ User already has avatar')
      throw new BadRequestException(ERROR_MESSAGES.USER_ALREADY_HAS_AVATAR)
    }

    const { path } = await this.filesService.uploadFile({
      name: avatarFile.originalname,
      file: avatarFile,
      folder: 'avatars',
    })

    await this.avatarsRepository.createAvatar({ userId, path })

    this.logger.log('✅ Creating avatar was successful')

    return { path }
  }

  public async deleteAvatar(
    userId: number,
    avatarId: number,
  ): Promise<AvatarDto> {
    this.logger.log('🔍 Beginning of deleting avatar')

    const avatar = await this.avatarsRepository.getUserAvatar(avatarId)

    if (!avatar || avatar.userId !== userId) {
      this.logger.error('❌ Avatar not found')
      throw new BadRequestException(ERROR_MESSAGES.AVATAR_NOT_FOUND)
    }

    await this.filesService.removeFile({ path: avatar.path })
    await this.avatarsRepository.deleteAvatar(avatarId)

    this.logger.log('✅ Deleting avatar was successful')

    return avatar
  }
}
