import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessesModule } from './businesses/businesses.module';
import { AgentsModule } from './agents/agents.module';
import { DocumentsModule } from './documents/documents.module';
import { User } from './users/entities/user.entity';
import { Business } from './businesses/entities/business.entity';
import { Agent } from './agents/entities/agent.entity';
import { Document } from './documents/entities/document.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'dolma'),
        password: configService.get('DB_PASSWORD', 'dolma_password'),
        database: configService.get('DB_NAME', 'dolma_ai_db'),
        entities: [User, Business, Agent, Document],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UsersModule,
    BusinessesModule,
    AgentsModule,
    DocumentsModule,
  ],
})
export class AppModule {}
