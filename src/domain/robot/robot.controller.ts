import { Controller, Get, Post, Body, Query, Param, Patch } from '@nestjs/common';
import { RobotService } from './robot.service';
import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';
import { FilterDto } from '../shared/filter-dto';
import { Resources } from 'src/consts/resources';
import { Authorization } from '../shared/authorization/authorization.decorator';
import { Actions } from 'src/consts/actions';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DetailsRobot } from './dto/details-robot.dto';

@ApiTags('robot')
@ApiBearerAuth()
@Controller('robot')
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Authorization({ permissions: [{ resource: Resources.robots, action: Actions.create }] })
  @Post()
  @ApiOperation({ summary: 'Criar robô' })
  @ApiOkResponse({ description: 'Robô criado (retorno inclui relations: columns)', type: DetailsRobot })
  @ApiBadRequestResponse({ description: 'Dados inválidos, sistema/credencial não encontrado ou colunas inválidas' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para criar robô' })
  async create(@Body() createRobotDto: CreateRobotDto) {
    return await this.robotService.create(createRobotDto);
  }

  @Authorization({ permissions: [{ resource: Resources.robots, action: Actions.read }] })
  @Get()
  @ApiOperation({ summary: 'Listar robôs' })
  @ApiOkResponse({ type: [DetailsRobot] })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para listar robôs' })
  async findAll(@Query() filter: FilterDto) {
    return await this.robotService.findAll(filter);
  }

  @Authorization({ permissions: [{ resource: Resources.robots, action: Actions.read }] })
  @Get('columns')
  @ApiOperation({ summary: 'Obter colunas por nome da tabela' })
  @ApiQuery({ name: 'tableName' })
  @ApiOkResponse({ description: 'Lista de colunas da tabela (column_name, attnum, data_type, is_nullable)' })
  @ApiBadRequestResponse({ description: 'Tabela informada não existe' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para obter colunas' })
  async getColumns(@Query('tableName') tableName: string) {
    return await this.robotService.getColumnsDataByTableName(tableName);
  }

  @Authorization({ permissions: [{ resource: Resources.robots, action: Actions.read }] })
  @Get(':id')
  @ApiOperation({ summary: 'Buscar robô por ID (inclui relations: columns)' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: DetailsRobot })
  @ApiBadRequestResponse({ description: 'Robô não encontrado para o ID informado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para visualizar robô' })
  async findOne(@Param('id') id: string) {
    return await this.robotService.findOne(+id);
  }

  @Authorization({ permissions: [{ resource: Resources.robots, action: Actions.update }] })
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar robô' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: DetailsRobot })
  @ApiBadRequestResponse({ description: 'Robô/sistema/credencial não encontrado ou dados de colunas inválidos' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para atualizar robô' })
  async update(@Param('id') id: string, @Body() updateRobotDto: UpdateRobotDto) {
    return await this.robotService.update(+id, updateRobotDto);
  }
}
