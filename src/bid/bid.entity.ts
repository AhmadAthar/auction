import { IBid, IItem, IUser } from "@app/common";
import { Item } from "src/item/item.entity";
import { User } from "src/user/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bid implements IBid{
    
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('numeric')
    public price: number;

    @Column('uuid')
    public userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId"})
    public user?: IUser;

    @Column('uuid')
    public itemId: string;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'itemId'})
    public item?: IItem;

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