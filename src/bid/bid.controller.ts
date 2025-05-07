import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { BidQueueService } from './bid-queue.service';
import { BidService } from './bid.service';
import { CreateBidDto } from '@app/common/dtos/create-bid.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';

@Controller('bid')
export class BidController {
    public queueEvents;
    public constructor(
        // private readonly bidQueueService: BidQueueService,
        @InjectQueue('bid') private readonly bidQueue: Queue,
        private readonly bidService: BidService
    ) {
        this.queueEvents = new QueueEvents('bid', {
            connection: {
                host: 'localhost',
                port: 6379,
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
            console.log("result: ", result)
            return result;
        } catch (error) {
            console.log("error:  ***********************************************************************", error.message)
            if (error.message === 'Bid must be higher than current highest bid') {
                throw new BadRequestException(error.message);
              }
        }
    }
}
