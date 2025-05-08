import { Processor, WorkerHost } from "@nestjs/bullmq";
import { BidService } from "./bid.service";
import { Job } from "bullmq";
import { InternalServerErrorException } from "@nestjs/common";
import { handleError } from "@app/common";

@Processor('bid')
export class BidQueueService extends WorkerHost {

    public constructor(
        private readonly bidService: BidService
    ) { 
        super();
    }


    override async process(job: Job<any>) {
        try {
            const result = await this.bidService.createBid(job.data);
            return result;
        } catch (error) {
            handleError(error);
        }
    }
}