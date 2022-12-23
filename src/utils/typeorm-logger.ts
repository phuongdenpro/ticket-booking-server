import { Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'typeorm';

export class DatabaseLogger implements Logger {
  private readonly logger = new NestLogger(this.constructor.name);

  logQuery(query: string, parameters?: any[]) {
    this.logger.log({ message: 'Query', sql: query, params: parameters });
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    let message: 'Query Error: ';
    let stack;
    if (typeof error === 'string') message += error;
    else {
      message += error.message;
      stack = error.stack;
    }

    this.logger.log({ message, sql: query, params: parameters, stack });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.log({
      message: 'Query Slow',
      time,
      sql: query,
      params: parameters,
    });
  }

  logSchemaBuild(message: string) {
    this.logger.log({ message: `Schema: ${message}` });
  }

  logMigration(message: string) {
    this.logger.log({ message: `Migration: ${message}` });
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    let logger;
    switch (level) {
      case 'log':
        logger = this.logger.log;
        break;

      case 'info':
        logger = this.logger.verbose;
        break;

      case 'warn':
        logger = this.logger.warn;
        break;
    }

    logger(message);
  }
}
