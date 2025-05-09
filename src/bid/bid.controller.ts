import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { BidQueueService } from './bid-queue.service';
import { BidService } from './bid.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { CreateBidDto, handleError } from '@app/common';
import { ConfigService } from '@nestjs/config';

@Controller('bid')
export class BidController {
    public queueEvents;
    public constructor(
        @InjectQueue('bid') private readonly bidQueue: Queue,
        private readonly configService: ConfigService
    ) {
        this.queueEvents = new QueueEvents('bid', {
            connection: {
                host: this.configService.get('REDIS_HOST'),
                port: parseFloat(this.configService.get('REDIS_PORT')),
                username: this.configService.get('REDIS_USERNAME'),
                password: this.configService.get('REDIS_PASSWORD')
            },
        });
    }

    @Post('createBid')
    public async createBid(
        @Body() createBidDto: CreateBidDto
    ) {
        try {
            const job = await this.bidQueue.add('place-bid', createBidDto, { removeOnComplete: true, removeOnFail: true });
            const result = await job.waitUntilFinished(this.queueEvents);
            return result;
        } catch (error) {
            handleError(error);
            
        }
    }
}
