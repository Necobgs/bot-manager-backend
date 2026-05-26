import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SystemService } from './system.service';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { plainToClass } from 'class-transformer';
import { SystemDto } from './dto/system.dto';
import { FilterDto } from '../shared/filter-dto';
import { Authorization } from '../shared/authorization/authorization.decorator';
import { Resources } from 'src/consts/resources';
import { Actions } from 'src/consts/actions';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('system')
@ApiBearerAuth()
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) { }

  @Authorization({ permissions: [{ resource: Resources.systems, action: Actions.create }] })
  @Post()
  @ApiOperation({ summary: 'Criar sistema' })
  @ApiOkResponse({ type: SystemDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos ou nome de sistema já cadastrado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para criar sistema' })
  async create(@Body() createSystemDto: CreateSystemDto) {
    return this.systemService.create(createSystemDto).then(
      system => plainToClass(SystemDto, system)
    );
  }

  @Authorization({ permissions: [{ resource: Resources.systems, action: Actions.read }] })
  @Get()
  @ApiOperation({ summary: 'Listar sistemas' })
  @ApiOkResponse({ type: [SystemDto] })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para listar sistemas' })
  async findAll(@Query() filter: FilterDto) {
    return await this.systemService.findAll(filter);
  }

  @Authorization({ permissions: [{ resource: Resources.systems, action: Actions.read }] })
  @Get(':id')
  @ApiOperation({ summary: 'Buscar sistema por ID' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: SystemDto })
  @ApiBadRequestResponse({ description: 'Sistema não encontrado para o ID informado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para visualizar sistema' })
  async findOne(@Param('id') id: string) {
    return await this.systemService.findOne(+id);
  }

  @Authorization({ permissions: [{ resource: Resources.systems, action: Actions.update }] })
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar sistema' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: SystemDto })
  @ApiBadRequestResponse({ description: 'Sistema não encontrado ou dados de entrada inválidos' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para atualizar sistema' })
  async update(@Param('id') id: number, @Body() dto: UpdateSystemDto) {
    return await this.systemService.update(+id, dto);
  }

  @Authorization({ permissions: [{ resource: Resources.systems, action: Actions.delete }] })
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir sistema' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Sistema excluído com sucesso' })
  @ApiBadRequestResponse({ description: 'Sistema não encontrado para o ID informado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para excluir sistema' })
  async delete(@Param('id') id: string) {
    return await this.systemService.delete(+id)
  }

}
