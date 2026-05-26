import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatusResponseDto } from '../../task_status/dto/task-status-response.dto';

/**
 * Resposta do GET /task (lista de tarefas).
 * Inclui a relação taskStatus (carregada). Não inclui importedBy.
 */
export class FindAllTaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ nullable: true, description: 'Data/hora de início da execução' })
  startedAt: Date | null;

  @ApiPropertyOptional({ nullable: true, description: 'Resposta da execução' })
  response: string | null;

  @ApiPropertyOptional({ nullable: true, description: 'Observação' })
  observation: string | null;

  @ApiProperty({ nullable: true, description: 'Data/hora agendada para início' })
  scheduleInit: Date | null;

  @ApiProperty({ nullable: true, description: 'Data/hora de término' })
  endedAt: Date | null;

  @ApiProperty({ description: 'Quantidade total de itens' })
  qtyTotal: number;

  @ApiProperty({ default: 0, description: 'Quantidade de erros' })
  qtyError: number;

  @ApiProperty({ default: 0, description: 'Quantidade de sucessos' })
  qtySuccess: number;

  @ApiProperty({ default: 0, description: 'Quantidade concluída' })
  qtyDone: number;

  @ApiProperty({ type: () => TaskStatusResponseDto, description: 'Status da tarefa (relação carregada)' })
  taskStatus: TaskStatusResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;
}
