import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { BullModule } from '@nestjs/bullmq';
import { BidQueueService } from './bid-queue.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid]),
    BullModule.registerQueue({
      name: 'bid',
      connection: {
        host: "redis-13573.c256.us-east-1-2.ec2.redns.redis-cloud.com",
        port: 13573,
        username: 'default',
        password: "CV7OCsr2qijOneb6iAq6cX479VATnpXo"
      }
    })
],
  providers: [BidService, BidQueueService],
  controllers: [BidController]
})
export class BidModule {}
