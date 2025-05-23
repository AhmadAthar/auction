import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { BidModule } from './bid/bid.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';
import { Bid } from './bid/bid.entity';
import { Item } from './item/item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './dev.env',
      ignoreEnvFile: process.env.NODE_ENV === 'dev',
    }),
    TypeOrmModule.forRootAsync({
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
            rejectUnauthorized: configService.get("DB_SSL") === 'true'
          },
          autoLoadEntities: configService.get("DB_ALE") === 'true',

        })
      }
    }),
    UserModule,
    ItemModule,
    BidModule,
    GatewayModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
