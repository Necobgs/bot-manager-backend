import { Transform } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: 'Nome do Usuário' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'email@exemplo.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'usuario', description: 'Login (AD)' })
  @IsNotEmpty()
  @IsString()
  ad: string;

  @ApiProperty({ example: '********', minLength: 6 })
  @MinLength(6)
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: 'IDs dos robôs', type: [Number], isArray: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => [...new Set(value)])
  robotsId: number[];

  @ApiPropertyOptional({ description: 'IDs das permissões', type: [Number], isArray: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => [...new Set(value)])
  permissionsId: number[];

  @ApiProperty({ description: 'ID da role', minimum: 1, example: 1 })
  @IsNotEmpty()
  @Min(1)
  @IsInt()
  role: number;
}