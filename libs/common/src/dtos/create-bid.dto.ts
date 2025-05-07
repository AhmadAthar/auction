import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateBidDto{
    @IsUUID()
    @IsNotEmpty()
    public itemId: string;

    @IsUUID()
    @IsNotEmpty()
    public userId: string;

    @IsNumber()
    @IsNotEmpty()
    public price: number;
}