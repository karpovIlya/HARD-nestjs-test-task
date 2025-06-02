import { ConfigModule, ConfigService } from '@nestjs/config'
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize'

interface ISequelizeConfig {
  hostPath?: string
  portPath?: string
  usernamePath?: string
  passwordPath?: string
  databasePath?: string
}

export const getSequelizeConfig = (
  config: ISequelizeConfig,
): SequelizeModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    dialect: 'postgres',
    host: configService.get(config.hostPath || 'POSTGRES_HOST'),
    port: +configService.get(config.portPath || 'POSTGRES_PORT'),
    username: configService.get(config.usernamePath || 'POSTGRES_USER'),
    password: configService.get(config.passwordPath || 'POSTGRES_PASSWORD'),
    database: configService.get(config.databasePath || 'POSTGRES_DB'),
    autoLoadModels: true,
    synchronize: true,
  }),
})
