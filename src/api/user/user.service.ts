import { UserStatusEnum } from './../../enums';
import { Customer } from './../../database/entities';
import { AuthService } from './../../auth/auth.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../customer/customer.service';
import { Repository } from 'typeorm';
import { UpdateCustomerDto, UserUpdatePasswordDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
@ApiTags('User')
export class UserService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private customerService: CustomerService,
    private authService: AuthService,
  ) {}

  async getCustomerStatus() {
    return this.customerService.getCustomerStatus();
  }

  async profile(id: string) {
    const userExist = this.customerService.getCustomerById(id);
    if (!userExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    return userExist;
  }

  async updatePassword(id: string, dto: UserUpdatePasswordDto) {
    const userExist = await this.customerService.getCustomerById(id, {
      select: { password: true },
    });
    if (!userExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }
    if (userExist?.status === UserStatusEnum.INACTIVATE) {
      throw new BadRequestException('USER_NOT_ACTIVE');
    }
    if (!dto?.oldPassword) {
      throw new BadRequestException('OLD_PASSWORD_REQUIRED');
    }
    if (!dto?.newPassword) {
      throw new BadRequestException('NEW_PASSWORD_REQUIRED');
    }
    if (!dto?.confirmNewPassword) {
      throw new BadRequestException('CONFIRM_NEW_PASSWORD_REQUIRED');
    }
    const isPasswordMatches = await this.authService.comparePassword(
      dto?.oldPassword,
      userExist?.password,
    );
    if (!isPasswordMatches)
      throw new BadRequestException('PASSWORD_OLD_NOT_MATCH');
    if (dto?.newPassword !== dto?.confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');
    if (dto?.oldPassword === dto?.newPassword) {
      throw new BadRequestException('PASSWORD_NEW_SAME_OLD');
    }

    const passwordHash = await this.authService.hashData(dto.newPassword);
    userExist.password = passwordHash;
    userExist.updatedBy = userExist.id;
    const saveCustomer = await this.customerRepository.save(userExist);
    delete saveCustomer.password;
    delete saveCustomer.updatedBy;
    delete saveCustomer.refreshToken;
    delete saveCustomer.accessToken;

    return saveCustomer;
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto, userId: string) {
    return await this.customerService.updateCustomer(id, dto, userId);
  }
}
