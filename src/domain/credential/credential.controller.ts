import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { plainToClass } from 'class-transformer';
import { CredentialDto } from './dto/credential.dto';
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

@ApiTags('credential')
@ApiBearerAuth()
@Controller('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Authorization({ permissions: [{ resource: Resources.credentials, action: Actions.create }] })
  @Post()
  @ApiOperation({ summary: 'Criar credencial' })
  @ApiOkResponse({ type: CredentialDto })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos (validação)' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para criar credencial' })
  async create(@Body() createCredentialDto: CreateCredentialDto) {
    return this.credentialService.create(createCredentialDto).then(
      credential=>plainToClass(CredentialDto,credential)
    );
  }

  @Authorization({ permissions: [{ resource: Resources.credentials, action: Actions.read }] })
  @Get()
  @ApiOperation({ summary: 'Listar credenciais' })
  @ApiOkResponse({ type: [CredentialDto] })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para listar credenciais' })
  async findAll(@Query() filter:FilterDto) {
    return await this.credentialService.findAll(filter)
  }

  @Authorization({ permissions: [{ resource: Resources.credentials, action: Actions.read }] })
  @Get(':id')
  @ApiOperation({ summary: 'Buscar credencial por ID' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: CredentialDto })
  @ApiBadRequestResponse({ description: 'Credencial não encontrada para o ID informado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para visualizar credencial' })
  async findOne(@Param('id') id:string){
    return this.credentialService.findOne(+id);
  }

  @Authorization({ permissions: [{ resource: Resources.credentials, action: Actions.update }] })
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar credencial' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: CredentialDto })
  @ApiBadRequestResponse({ description: 'Credencial não encontrada ou dados de entrada inválidos' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para atualizar credencial' })
  async update(@Param('id') id:string,@Body() dto:UpdateCredentialDto){
    return await this.credentialService.update(+id,dto);
  }

  @Authorization({ permissions: [{ resource: Resources.credentials, action: Actions.delete }] })
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir credencial' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Credencial excluída com sucesso' })
  @ApiBadRequestResponse({ description: 'Credencial não encontrada para o ID informado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para excluir credencial' })
  async delete(@Param('id') id:string){
    return this.credentialService.delete(+id);
  }
}
