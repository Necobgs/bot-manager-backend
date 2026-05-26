import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from '../shared/public.decorator';
import {
  AuthorizationDecoratorArgs,
  KEY_AUTHORIZATION,
} from '../shared/authorization/authorization.decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // 1️ Executa autenticação JWT primeiro
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) return false;

    const requiredPermissions =
      this.reflector.getAllAndOverride<AuthorizationDecoratorArgs>(
        KEY_AUTHORIZATION,
        [context.getHandler(), context.getClass()],
      );

    // 2️ Se não exige permissão, só JWT já basta
    if (!requiredPermissions?.permissions?.length) return true;

    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    // 3️ Validação de permissão
    const hasPermissions = await this.userService.hasPermissions(
      userId,
      requiredPermissions,
    );

    if (!hasPermissions) {
      throw new ForbiddenException('Permissão insuficiente');
    }

    return true;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
