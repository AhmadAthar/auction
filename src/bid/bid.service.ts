import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Bid } from './bid.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { tryCatch } from 'bullmq';
import { Item } from 'src/item/item.entity';
import { IBid } from '@app/common';
import { CreateBidDto } from '@app/common/dtos/create-bid.dto';
import { handleError } from '@app/common/helpers/error.handler';

@Injectable()
export class BidService {
    public constructor(
        @InjectRepository(Bid)
        private readonly bidRepository: Repository<Bid>,
        private readonly dataSource: DataSource
    ) { }

    public async createBid(createBidDto: CreateBidDto): Promise<IBid>{
        try {
            const { itemId, userId, price } = createBidDto;
            return await this.dataSource.transaction(async (manager) => {
                const item = await manager.findOne(Item, {
                    where: { id: itemId },
                });


                if (!item) {
                    throw new NotFoundException('No item auction found!');
                }

                const highestBid = await manager
                    .createQueryBuilder(Bid, 'bid')
                    .where('bid.itemId = :itemId', { itemId })
                    .orderBy('bid.price', 'DESC')
                    .getOne();


                if (highestBid && price <= highestBid.price) {
                    throw new BadRequestException('Bid must be higher than current highest bid');
                }

                // TODO : add validation for duration
                // if (){}

                const bid: IBid = manager.create(Bid, {
                    itemId,
                    userId,
                    price
                });
                return await manager.save(bid);
            });

        } catch (error) {
            handleError(error);
        }
    }
}
