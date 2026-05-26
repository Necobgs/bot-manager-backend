import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({ description: 'Login (AD)', example: 'usuario' })
  @IsNotEmpty()
  @IsString()
  ad: string;

  @ApiProperty({ description: 'Senha', example: '********' })
  @IsNotEmpty()
  @IsString()
  password: string;
}