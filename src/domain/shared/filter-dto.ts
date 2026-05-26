import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Filter } from './apply-filters';

export class FilterDto {
  @ApiPropertyOptional({
    description: 'Filtro em JSON (operadores: $eq, $ne, $gt, $gte, $lt, $lte, $in, $like, $or, $and, etc.). Ver documentação em apply-filters.',
    example: { task_status: { identifier: { $eq: 'pending' } } },
  })
  @IsOptional()
  filter: Filter;

  @ApiPropertyOptional({ description: 'Página atual (paginação)', default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  page: number = 1;

  @ApiPropertyOptional({ description: 'Itens por página', default: 10, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  limit: number = 10;
}