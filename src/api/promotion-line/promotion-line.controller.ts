import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PromotionLineService } from './promotion-line.service';

@Controller('promotion-line')
@ApiTags('Promotion Line')
export class PromotionLineController {
  constructor(private promotionLineService: PromotionLineService) {}
}
