import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { RoleEnum } from './../../enums';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_ACCESS_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    const tokenRequest = req.headers['authorization'].replace('Bearer ', '');
    const user = await this.authService.validateUserByJwt(payload);
    if (!user) throw new UnauthorizedException('WRONG_CREDENTIALS');

    // user just login one device
    if (payload.type === RoleEnum.CUSTOMER) {
      if (tokenRequest !== user.access_token)
        throw new UnauthorizedException('WRONG_CREDENTIALS');
    }

    return { id: user.id, email: user.email, type: payload.type };
  }
}
