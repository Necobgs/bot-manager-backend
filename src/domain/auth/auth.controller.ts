import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../shared/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login (rota pública)' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ description: 'Token JWT', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Dados de login inválidos (validação)' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas (usuário ou senha incorretos)' })
  async login(@Body() signInDto: SignInDto) {
    const user = await this.authService.validateUser(signInDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}