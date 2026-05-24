import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '../config/env.schema';
import { HealthController } from '../health/health.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from '../users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    PrismaModule,
  ],
  controllers: [HealthController, UsersController],
})
export class AppModule {}
