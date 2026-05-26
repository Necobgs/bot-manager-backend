import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT para uso no header Authorization: Bearer <token>' })
  accessToken: string;
}
