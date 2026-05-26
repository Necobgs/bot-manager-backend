import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSystemDto {
  @ApiProperty({ example: 'Nome do sistema', description: 'NOME DO SISTEMA' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  name: string;

  @ApiPropertyOptional({ example: 'https://sistema.exemplo.com' })
  @IsOptional()
  @IsUrl()
  @Transform(({ value }) => value.toLowerCase())
  url: string;
}