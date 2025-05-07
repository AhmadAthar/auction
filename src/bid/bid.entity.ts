import { IBid } from "@app/common";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bid implements IBid{
    
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('numeric')
    public price: number;

    @Column('uuid')
    public userId: string;

    @Column('uuid')
    public itemId: string;

    @Column('numeric')
    public createdAt: number;

    @Column('numeric', { nullable: true })
    public lastUpdatedAt?: number;

    @BeforeInsert()
    public addTime(){
        this.createdAt = new Date().getTime();
    }

    @BeforeUpdate()
    public updateTime(){
        this.lastUpdatedAt = new Date().getTime();
    }

}