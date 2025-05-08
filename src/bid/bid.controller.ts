import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { BidQueueService } from './bid-queue.service';
import { BidService } from './bid.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { CreateBidDto, handleError } from '@app/common';

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
                host: 'redis-13573.c256.us-east-1-2.ec2.redns.redis-cloud.com',
                port: 13573,
                username: "default",
                password: "CV7OCsr2qijOneb6iAq6cX479VATnpXo"
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
            handleError(error);
            
        }
    }
}
