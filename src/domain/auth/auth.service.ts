import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { User } from '../user/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  async login(user: User) {
    const payload = {
      id: user.id,
      sub: user.ad
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async validateUser(dto: SignInDto): Promise<User | null> {

    const user = await this.userService.findOneByAd(dto.ad)
    if (!user) throw new UnauthorizedException('Credentials not found')
    if (bcrypt.compare(dto.password, user.password)) {
      return user;
    }
    return null;
  }
}