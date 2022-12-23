import { Config } from '../entities';
import { CustomRepository } from '../typeorm-ex';
import { Repository } from 'typeorm';

@CustomRepository(Config)
export class ConfigRepository extends Repository<Config> {}
