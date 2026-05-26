import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Resposta do GET /task/:id (detalhe de uma tarefa).
 * Neste endpoint as relações task_status e imported_by não são carregadas.
 */
export class TaskDetailResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ nullable: true })
  startedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  response: string | null;

  @ApiPropertyOptional({ nullable: true })
  observation: string | null;

  @ApiPropertyOptional({ nullable: true })
  scheduleInit: Date | null;

  @ApiPropertyOptional({ nullable: true })
  endedAt: Date | null;

  @ApiProperty()
  qtyTotal: number;

  @ApiProperty({ default: 0 })
  qtyError: number;

  @ApiProperty({ default: 0 })
  qtySuccess: number;

  @ApiProperty({ default: 0 })
  qtyDone: number;

  @ApiPropertyOptional({
    description: 'Relação não carregada neste endpoint. Apenas id pode estar presente.',
  })
  taskStatus?: unknown;

  @ApiPropertyOptional({
    description: 'Relação não carregada neste endpoint. Apenas id pode estar presente.',
  })
  importedBy?: unknown;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ nullable: true })
  deletedAt: Date | null;
}
