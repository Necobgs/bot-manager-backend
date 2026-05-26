import { Controller, Get, Param, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
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
import { PermissionDto } from './dto/permission.dto';

@ApiTags('permission')
@ApiBearerAuth()
@Authorization({ permissions: [{ resource: Resources.permissions, action: Actions.read }] })
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: 'Listar permissões' })
  @ApiOkResponse({ type: [PermissionDto] })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para listar permissões' })
  async findAll(@Query() filter: FilterDto) {
    return await this.permissionService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar permissão por ID' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: PermissionDto })
  @ApiBadRequestResponse({ description: 'Permissão não encontrada para o ID informado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para visualizar permissão' })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }
}