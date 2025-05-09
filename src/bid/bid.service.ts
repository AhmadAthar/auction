import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Bid } from './bid.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { tryCatch } from 'bullmq';
import { Item } from 'src/item/item.entity';
import { CreateBidDto, handleError, IBid } from '@app/common';
import { NotificationsGateway } from 'src/gateway/notification-gateway';
import { User } from 'src/user/user.entity';

@Injectable()
export class BidService {
    public constructor(
        private readonly dataSource: DataSource,
        private readonly notificatonGateway: NotificationsGateway
    ) { }

    public async createBid(createBidDto: CreateBidDto): Promise<IBid> {
        try {
            const { itemId, userId, price } = createBidDto;
            return await this.dataSource.transaction(async (manager) => {
                
                const item = await manager.findOne(Item, {
                    where: { id: itemId },
                });

                if (!item) {
                    throw new NotFoundException('No item auction found');
                }

                const user = await manager.findOne(User, {
                    where: { id: userId }
                })

                if(!user){
                    throw new NotFoundException('User not found!')
                }

                const highestBid = item.highestBidId ? await manager
                    .createQueryBuilder(Bid, 'bid')
                    .where('bid.id = :bidId', { bidId: item.highestBidId })
                    .getOne() : null;

                if (new Date().getTime() > item.endTime) {
                    throw new BadRequestException("Item Expired")
                }

                if (highestBid && price <= highestBid.price) {
                    throw new BadRequestException('Bid must be higher than current highest bid');
                }

                const bid: IBid = manager.create(Bid, {
                    itemId,
                    userId,
                    price
                });

                const savedBid = await manager.save(bid);
                item.highestBidId = savedBid.id;
                await manager.save(item);
                this.notificatonGateway.handleSendNotification(null, { message: JSON.stringify({ item, savedBid })})
                return savedBid;
            });
        } catch (error) {
            handleError(error);
        }
    }

}
