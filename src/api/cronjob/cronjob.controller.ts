import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('cronjob')
@ApiTags('Cronjob')
export class CronjobController {}
