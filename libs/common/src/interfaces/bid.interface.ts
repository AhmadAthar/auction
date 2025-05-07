import { IItem } from "./item.interface";
import { IUser } from "./user.interface";

export interface IBid{
    id: string;
    userId: string;
    user?: IUser;
    itemId: string;
    item?: IItem;
    createdAt: number;
    lastUpdatedAt?: number;
}