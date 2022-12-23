import { SetMetadata } from '@nestjs/common';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from './typeorm-ex.constant';

// eslint-disable-next-line @typescript-eslint/ban-types
export function CustomRepository(entity: Function): ClassDecorator {
  return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}
