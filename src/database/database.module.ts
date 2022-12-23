import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmExModule } from './typeorm-ex';
import {toBoolean} from '../utils/to-boolean';

import * as dbEntities from './entities';
import * as dbRepos from './repositories';
import { DatabaseLogger } from 'src/utils';

const entities = (Object.keys(dbEntities) as Array<keyof typeof dbEntities>).map(
  (entity) => dbEntities[entity]
);
const repositories = (Object.keys(dbRepos) as Array<keyof typeof dbRepos>).map(
  (repository) => dbRepos[repository]
);

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
      }),
    }),
    TypeOrmExModule.forCustomRepository(repositories),
  ],
})
export class DatabaseModule {}
