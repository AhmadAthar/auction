import { Body, Controller, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, IItem } from '@app/common';

@Controller('item')
export class ItemController {
    
    public constructor(
        private readonly itemService: ItemService
    ){}

    @Post('createItem')
    public createItem(
        @Body() createItemDto: CreateItemDto
    ): Promise<IItem>{
        return this.itemService.createItem(createItemDto);
    }
}
