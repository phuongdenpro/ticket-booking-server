import { DatabaseLogger } from './../utils/typeorm-logger';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { toBoolean } from '../utils/to-boolean';

import * as dbEntities from './entities';

const entities = (
  Object.keys(dbEntities) as Array<keyof typeof dbEntities>
).map((entity) => dbEntities[entity]);
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_DIALECT'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_DATABASE'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        keepConnectionAlive: true,
        entities,
        synchronize: toBoolean(configService.get('DB_SYNC')),
        logger: toBoolean(configService.get('DB_LOG')) && new DatabaseLogger(),
        logging: toBoolean(configService.get('DB_LOG')) && ['query'],
        timezone: "Asia/Ho_Chi_Minh",
      }),
    }),
  ],
})
export class DatabaseModule {}
