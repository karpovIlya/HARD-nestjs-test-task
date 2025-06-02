import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { FeaturesModule } from './features/features.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    FeaturesModule,
  ],
})
export class AppModule {}
