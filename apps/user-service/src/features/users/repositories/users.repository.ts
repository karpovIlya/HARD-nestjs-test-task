import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, Transaction, literal } from 'sequelize'
import { ERROR_MESSAGES } from '@app/consts'

import { User } from '../models/users.model'
import { UserEntity } from '../entities/user.entity'
import { UsersFiltersQueryDto } from '../dto/users-filters-query.dto'
import { CreateUserDto } from '../dto/create-user.dto'

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name)

  constructor(@InjectModel(User) private readonly userData: typeof User) {}

  public async getUserCount(): Promise<number> {
    this.logger.log('🔍 Beginning of getting user count')

    const userCount = await this.userData.count()

    this.logger.log('✅ Getting user count was successful')

    return userCount
  }

  public async getUserByEmail(soughtEmail: string): Promise<UserEntity> {
    this.logger.log('🔍 Beginning of getting user by email')

    const user = await this.userData.findOne({
      where: { email: soughtEmail },
    })

    if (!user) {
      this.logger.error('❌ User not found')
      throw new NotFoundException(ERROR_MESSAGES.NO_USER_WITH_THIS_EMAIL)
    }

    this.logger.log('✅ Getting user by email was successful')

    return new UserEntity(user.toJSON())
  }

  public async getPaginatedUsers(
    limit: number,
    offset: number,
    filters: UsersFiltersQueryDto,
  ): Promise<UserEntity[]> {
    this.logger.log('🔍 Beginning of getting paginated users')

    const paginatedUsers = await this.userData.findAndCountAll({
      where: {
        login: { [Op.like]: `%${filters.login || ''}%` },
      },
      offset,
      limit,
    })

    this.logger.log('✅ Getting paginated users was successful')

    return paginatedUsers.rows.map((user) => new UserEntity(user.toJSON()))
  }

  public async getUserById(id: number): Promise<UserEntity> {
    this.logger.log('🔍 Beginning of getting user by id')

    const user = await this.userData.findByPk(id)

    if (!user) {
      this.logger.error('❌ User not found')
      throw new NotFoundException(ERROR_MESSAGES.NO_USER_WITH_THIS_ID)
    }

    this.logger.log('✅ Getting user by id was successful')

    return new UserEntity(user.toJSON())
  }

  public async checkUserAlreadyExist(email: string): Promise<boolean> {
    this.logger.log('🔍 Beginning of checking user already exist')

    const user = await this.userData.findOne({ where: { email } })

    this.logger.log('✅ Checking user already exist was successful')

    return !!user
  }

  public async addUser(userDto: CreateUserDto): Promise<UserEntity> {
    this.logger.log('🔍 Beginning of adding user')

    const user = await this.userData.create(userDto)

    this.logger.log('✅ Adding user was successful')

    return new UserEntity(user.toJSON())
  }

  public async destroyUser(id: number) {
    this.logger.log('🔍 Beginning of destroying user')

    await this.userData.destroy({ where: { id } })

    this.logger.log('✅ Destroying user was successful')
  }

  public async getAllUsersWithPositiveBalance(
    transaction?: Transaction,
  ): Promise<UserEntity[]> {
    this.logger.log('🔍 Beginning of getting all users with positive balance')

    const users = await this.userData.findAll({
      attributes: ['id', 'balance'],
      where: { balance: { [Op.ne]: 0 } },
      lock: transaction?.LOCK.UPDATE,
      transaction,
    })

    this.logger.log('✅ Getting all users with positive balance was successful')

    return users.map((user) => new UserEntity(user.toJSON()))
  }

  public async resetAllUsersBalance(transaction?: Transaction) {
    await this.userData.update(
      { balance: 0 },
      { where: { balance: { [Op.ne]: 0 } }, transaction },
    )
  }

  public async addUserBalance(
    userId: number,
    addToBalance: number,
    transaction?: Transaction,
  ) {
    this.logger.log('🔍 Beginning of adding user balance')

    await this.userData.update(
      { balance: literal(`balance + ${addToBalance}`) },
      { where: { id: userId }, transaction },
    )

    this.logger.log('✅ Adding user balance was successful')
  }

  public async subtractUserBalance(
    userId: number,
    subtractToBalance: number,
    transaction?: Transaction,
  ) {
    this.logger.log('🔍 Beginning of subtracting user balance')

    if (subtractToBalance < 0) {
      this.logger.error('❌ Negative balance')
      throw new BadRequestException(ERROR_MESSAGES.NEGATIVE_BALANCE)
    }

    const user = await this.userData.findByPk(userId, { transaction })

    if (!user) {
      this.logger.error('❌ User not found')
      throw new NotFoundException(ERROR_MESSAGES.NO_USER_WITH_THIS_ID)
    }

    if (user.get('balance') < subtractToBalance) {
      this.logger.error('❌ Not enough money')
      throw new BadRequestException(ERROR_MESSAGES.NOT_ENOUGH_MONEY)
    }

    await this.userData.update(
      { balance: literal(`balance - ${subtractToBalance}`) },
      { where: { id: userId }, transaction },
    )

    this.logger.log('✅ Subtracting user balance was successful')
  }
}
