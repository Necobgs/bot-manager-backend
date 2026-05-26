import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AggregateRootDto } from 'src/domain/shared/aggregate-root.dto';

@Exclude()
export class UserDto extends AggregateRootDto {
  @ApiProperty({ example: 'usuario' })
  @Expose()
  ad: string;

  @ApiProperty({ example: 'Nome do Usuário' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'email@exemplo.com' })
  @Expose()
  email: string;

  @Exclude()
  password: string;
}