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
        host: "localhost",
        port: 6379
      }
    })
],
  providers: [BidService, BidQueueService],
  controllers: [BidController]
})
export class BidModule {}
