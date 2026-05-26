import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Authorization } from '../shared/authorization/authorization.decorator';
import { Resources } from 'src/consts/resources';
import { Actions } from 'src/consts/actions';
import { FilterDto } from '../shared/filter-dto';
import { User } from '../user/entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FindAllTaskResponseDto } from './dto/find-all-task-response.dto';
import { TaskDetailResponseDto } from './dto/task-detail-response.dto';

@ApiTags('task')
@ApiBearerAuth()
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Authorization({ permissions: [{ resource: Resources.tasks, action: Actions.create }] })
  @Post()
  @ApiOperation({ summary: 'Criar tarefa de importação' })
  @ApiOkResponse({ description: 'Tarefa criada', type: TaskDetailResponseDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos (validação)' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para criar tarefa' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    return this.taskService.create(createTaskDto, req.user as User);
  }

  @Authorization({ permissions: [{ resource: Resources.tasks, action: Actions.read }] })
  @Get()
  @ApiOperation({ summary: 'Listar tarefas (inclui task_status, não inclui imported_by)' })
  @ApiOkResponse({ type: [FindAllTaskResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para listar tarefas' })
  async findAll(@Query() filter: FilterDto): Promise<FindAllTaskResponseDto[]> {
    return this.taskService.findAll(filter);
  }

  @Authorization({ permissions: [{ resource: Resources.tasks, action: Actions.read }] })
  @Get(':id')
  @ApiOperation({ summary: 'Buscar tarefa por ID (relações não carregadas)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: TaskDetailResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para visualizar tarefa' })
  findOne(@Param('id') id: string) {
    return this.taskService.findOneBy('id', +id);
  }

  @Authorization({ permissions: [{ resource: Resources.tasks, action: Actions.update }] })
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tarefa' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: TaskDetailResponseDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos (validação)' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para atualizar tarefa' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Authorization({ permissions: [{ resource: Resources.tasks, action: Actions.delete }] })
  @Delete(':id')
  @ApiOperation({ summary: 'Remover tarefa (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Tarefa removida com sucesso (soft delete)' })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para remover tarefa' })
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}