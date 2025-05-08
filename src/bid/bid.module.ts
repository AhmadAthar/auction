import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { BullModule } from '@nestjs/bullmq';
import { BidQueueService } from './bid-queue.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    GatewayModule,
    ConfigModule,
    TypeOrmModule.forFeature([Bid]),
    BullModule.registerQueueAsync({
      name: 'bid',
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: parseInt(configService.get<string>('REDIS_PORT')),
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
],
  providers: [BidService, BidQueueService],
  controllers: [BidController]
})
export class BidModule {}
