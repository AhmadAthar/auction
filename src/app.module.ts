import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { BidModule } from './bid/bid.module';
import { AuctionModule } from './auction/auction.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-icy-rain-a4w3beo9-pooler.us-east-1.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 'npg_4EDKW0CiwNzQ',
      database: 'neondb',
      synchronize: true,
      logging: false,
      ssl: {
        rejectUnauthorized: false, // Required for Neon and many other cloud hosts
      },
      autoLoadEntities: true,
      // type: 'postgres',
      // host: 'localhost',
      // port: 5432,
      // username: 'postgres',
      // password: 'postgres',
      // database: 'auction',
      // synchronize: true,
      // logging: false,
      // ssl: {
      //   rejectUnauthorized: false, // Required for Neon and many other cloud hosts
      // },
      // autoLoadEntities: true,
    }),
    UserModule,
    ItemModule,
    BidModule,
    AuctionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
