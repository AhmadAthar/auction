import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { BidModule } from './bid/bid.module';
import { AuctionModule } from './auction/auction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './dev.env'
    }),
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ({
          type: configService.get<'postgres'>("DB_TYPE"),
          host: configService.get("DB_HOST"),
          port: parseFloat(configService.get("DB_PORT")),
          username: configService.get("DB_USERNAME"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get<string>("DB_DATABASE"),
          synchronize: configService.get("DB_SYNCHRONIZE") === 'true',
          logging: configService.get("DB_LOGGING") === 'true',
          ssl: {
            rejectUnauthorized: configService.get("DB_SSL")
          },
          autoLoadEntities: configService.get("DB_ALE") === 'true',

        })
      }
    }),
    // TypeOrmModule.forRoot({
    //   type: Config,
    //   host: 'ep-icy-rain-a4w3beo9-pooler.us-east-1.aws.neon.tech',
    //   port: 5432,
    //   username: 'neondb_owner',
    //   password: 'npg_4EDKW0CiwNzQ',
    //   database: 'neondb',
    //   synchronize: true,
    //   logging: false,
    //   ssl: {
    //     rejectUnauthorized: false, // Required for Neon and many other cloud hosts
    //   },
    //   autoLoadEntities: true,
    //   // type: 'postgres',
    //   // host: 'localhost',
    //   // port: 5432,
    //   // username: 'postgres',
    //   // password: 'postgres',
    //   // database: 'auction',
    //   // synchronize: true,
    //   // logging: false,
    //   // ssl: {
    //   //   rejectUnauthorized: false, // Required for Neon and many other cloud hosts
    //   // },
    //   // autoLoadEntities: true,
    // }),
    UserModule,
    ItemModule,
    BidModule,
    AuctionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
