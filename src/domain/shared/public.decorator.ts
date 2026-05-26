import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca a rota como pública (sem autenticação).
 * No Swagger, o endpoint é documentado sem exigir Bearer token.
 */
export const Public = () => applyDecorators(
  SetMetadata(IS_PUBLIC_KEY, true),
  ApiOperation({ security: [] }),
);
