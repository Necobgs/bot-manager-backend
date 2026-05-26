import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";
import { IsUniqueFieldsByAttribute } from "src/utils/duplicators.validator";
import { CreateRobotColumnDto } from "../../robot-column/dto/create-robot-column.dto";

export class CreateRobotDto extends AggregateRootDto {
  @ApiProperty({ example: 'Nome do robô' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Objetivo do robô' })
  @IsNotEmpty()
  @IsString()
  objective: string;

  @ApiPropertyOptional({ description: 'Nome da tabela' })
  @IsString()
  @IsOptional()
  tableName: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  createRepository: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  createDocumentation: boolean;

  @ApiPropertyOptional({ type: [CreateRobotColumnDto] })
  @IsOptional()
  @IsUniqueFieldsByAttribute('attnum', { message: 'O campo "attnum" deve ser único' })
  @IsUniqueFieldsByAttribute('columnAlias', { message: 'O campo "columnAlias" deve ser único' })
  columns: CreateRobotColumnDto[];

  @ApiPropertyOptional({ description: 'IDs dos sistemas', type: [Number], isArray: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  systems: number[];

  @ApiPropertyOptional({ description: 'IDs das credenciais', type: [Number], isArray: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  credentials: number[];
}