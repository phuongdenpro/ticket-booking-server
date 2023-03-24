import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateApplicableTGDto {
  @IsString({ message: 'TICKET_GROUP_CODE_MUST_BE_STRING' })
  @IsNotEmpty({ message: 'TICKET_GROUP_CODE_IS_REQUIRED' })
  @Length(1, 100, { message: 'TICKET_GROUP_CODE_MUST_BE_BETWEEN_1_AND_100' })
  ticketGroupCode: string;

  @IsString({ message: 'PROMOTION_DETAIL_ID_MUST_BE_STRING' })
  @IsNotEmpty({ message: 'PROMOTION_DETAIL_ID_IS_REQUIRED' })
  @Length(1, 100, {
    message: 'PROMOTION_DETAIL_ID_MUST_BE_BETWEEN_1_AND_100_CHARACTERS',
  })
  promotionDetailId: string;
}
