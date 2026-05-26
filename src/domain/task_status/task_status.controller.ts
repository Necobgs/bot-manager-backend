import { Controller, Get, Param, Query } from '@nestjs/common';
import { TaskStatusService } from './task_status.service';
import { Authorization } from '../shared/authorization/authorization.decorator';
import { Resources } from 'src/consts/resources';
import { Actions } from 'src/consts/actions';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TaskStatusResponseDto } from './dto/task-status-response.dto';
import { TaskStatusFindAllDto } from './dto/task_status-find-all.dto';

@ApiTags('task-status')
@ApiBearerAuth()
@Controller('task-status')
export class TaskStatusController {
  constructor(private readonly taskStatusService: TaskStatusService) { }

  @Authorization({ permissions: [{ resource: Resources.tasks, action: Actions.read }] })
  @Get()
  @ApiOperation({ summary: 'Listar status de tarefa' })
  @ApiOkResponse({ type: [TaskStatusFindAllDto] })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  async findAll() {
    return await this.taskStatusService.findAll();
  }

  @Authorization({ permissions: [{ resource: Resources.tasks, action: Actions.read }] })
  @Get(':id')
  @ApiOperation({ summary: 'Buscar status por ID' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: TaskStatusResponseDto })
  @ApiBadRequestResponse({ description: 'Status de tarefa não encontrado para o ID informado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  findOne(@Param('id') id: string) {
    return this.taskStatusService.findOne(+id);
  }
}
