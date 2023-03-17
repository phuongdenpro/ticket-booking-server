import { Customer } from './../../database/entities';
import { AuthService } from './../../auth/auth.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../customer/customer.service';
import { DataSource, Repository } from 'typeorm';
import { UserUpdatePasswordDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
@ApiTags('User')
export class UserService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private customerService: CustomerService,
    private authService: AuthService,
    private dataSource: DataSource,
  ) {}

  async profile(id: string) {
    const userExist = this.customerService.getCustomerById(id);
    if (!userExist) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }
    return userExist;
  }

  async updatePassword(id: string, dto: UserUpdatePasswordDto) {
    const userExist = await this.customerService.getCustomerById(id);
    if (!userExist) {
      throw new BadRequestException('USER_NOT_FOUND');
    }

    const isPasswordMatches = await this.authService.comparePassword(
      dto?.oldPassword,
      userExist?.password,
    );
    if (!isPasswordMatches)
      throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    // if (!isPasswordMatches) throw new BadRequestException('OLD_PASSWORD_MISMATCH');
    if (dto?.newPassword !== dto?.confirmNewPassword)
      throw new BadRequestException('PASSWORD_NEW_NOT_MATCH');

    const passwordHash = await this.authService.hashData(dto.newPassword);
    return await this.customerRepository.update(
      { id: userExist.id },
      { password: passwordHash, updatedBy: userExist.id },
    );
  }
}
