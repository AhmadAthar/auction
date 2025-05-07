import { IUser } from "@app/common";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User implements IUser{

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column('text')
    public firstName: string;

    @Column('text')
    public lastName: string;

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