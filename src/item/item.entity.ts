import { IBid, IItem } from "@app/common";
import { Bid } from "src/bid/bid.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Item implements IItem{
    
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('text')
    public name: string;

    @Column('numeric')
    public startingPrice: number;

    // @Column('numeric', { nullable: true })
    // public highestPrice: number;
    @Column('uuid', { nullable: true })
    public highestBidId: string;

    @OneToOne(() => Bid)
    @JoinColumn({ name: 'highestBidId'})
    public highestBid: IBid
    
    @Column('numeric')
    public duration: number;
    
    @Column('numeric')
    public createdAt: number;

    @Column('numeric', { nullable: true })
    public lastUpdatedAt?: number;

    @BeforeInsert()
    public addTime(){
        this.createdAt = new Date().getTime()
    }

    @BeforeUpdate()
    public updateTime(){
        this.lastUpdatedAt = new Date().getTime()
    }
}