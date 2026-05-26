import { ApiProperty } from '@nestjs/swagger';

/**
 * Status da tarefa. Usado em respostas que carregam a relação task_status.
 */
export class TaskStatusResponseDto {
  @ApiProperty({ example: 1, description: 'ID do status' })
  id: number;

  @ApiProperty({ example: 'Pendente', description: 'Descrição do status' })
  description: string;

  @ApiProperty({ example: 'pending', description: 'Identificador único do status' })
  identifier: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;

  @ApiProperty({ nullable: true, description: 'Data de exclusão (soft delete)' })
  deletedAt: Date | null;
}
