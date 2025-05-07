import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IItem } from '@app/common';
import { CreateItemDto } from '@app/common/dtos/create-item.dto';

@Injectable()
export class ItemService {

    public constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>
    ){}

    public async createItem(createItemDto: CreateItemDto): Promise<IItem>{
        try {
            return await this.itemRepository.save(
                this.itemRepository.create({
                    ...createItemDto
                })
            )
        } catch (error) {
            console.error("error: ", error)
        }
    }
}
