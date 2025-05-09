import { IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateItemDto{
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsNotEmpty()
    public description: string;

    @IsNumber()
    @IsNotEmpty()
    public startingPrice: number;

    @IsNumber()
    @IsNotEmpty()
    public duration: number;
}