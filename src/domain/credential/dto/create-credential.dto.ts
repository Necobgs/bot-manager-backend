import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCredentialDto {
  @ApiProperty({ description: 'Senha' })
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ description: 'Usuário' })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiPropertyOptional({ description: 'Campo extra' })
  @IsOptional()
  @IsString()
  extraField?: string;
}