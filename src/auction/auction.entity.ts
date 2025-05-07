import { IAuction } from "@app/common/interfaces";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auction implements IAuction{

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('text')
    public name: string;

    @Column('numeric')
    public startDate: number;

    @Column('numeric')
    public endDate: number;

    @Column('numeric')
    public createdAt: number;

    @Column('numeric', { nullable: true })
    public lastUpdatedAt: number;

}