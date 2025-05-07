import { IUser } from "./user.interface";

export interface IAuction {
    id: string;
    name: string;
    userId?: string;
    user?: IUser;
    startDate: number;
    endDate: number;
    createdAt: number;
    lastUpdatedAt?: number;
}