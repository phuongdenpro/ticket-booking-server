import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ApplicableTicketGroup,
  PromotionDetail,
  Staff,
  TicketGroup,
} from './../../database/entities';
import { DataSource, Repository } from 'typeorm';
import { CreateApplicableTGDto } from './dto';

@Injectable()
export class ApplicableTicketGroupService {
  constructor(
    @InjectRepository(ApplicableTicketGroup)
    private readonly applicableTGRepository: Repository<ApplicableTicketGroup>,
    private dataSource: DataSource,
  ) {}

  async createApplicableTicketGroup(
    dto: CreateApplicableTGDto,
    adminId: string,
  ) {
    const { promotionDetailId, ticketGroupCode } = dto;
    const admin = await this.dataSource.getRepository(Staff).findOne({
      where: {
        id: adminId,
      },
    });
    if (!admin) {
      throw new Error('USER_NOT_FOUND');
    }
    if (!admin.isActive) {
      throw new Error('USER_NOT_ACTIVE');
    }
    const ticketGroup = await this.dataSource
      .getRepository(TicketGroup)
      .findOne({
        where: {
          code: ticketGroupCode,
        },
      });
    if (!ticketGroup) {
      throw new Error('TICKET_GROUP_NOT_FOUND');
    }

    const promotionDetail = await this.dataSource
      .getRepository(PromotionDetail)
      .findOne({
        where: {
          id: promotionDetailId,
        },
      });
    if (!promotionDetail) {
      throw new Error('PROMOTION_DETAIL_NOT_FOUND');
    }

    const applicableTG = new ApplicableTicketGroup();
    applicableTG.promotionDetail = promotionDetail;
    applicableTG.ticketGroup = ticketGroup;
    return await this.applicableTGRepository.save(applicableTG);
  }
}
