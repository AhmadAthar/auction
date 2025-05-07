export interface IItem{
    id: string;
    name: string;
    startingPrice: number;
    highestPrice?: number;
    createdAt: number;
    lastUpdatedAt?: number;
}