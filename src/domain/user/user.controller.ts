import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { FilterDto } from '../shared/filter-dto';
import { Public } from '../shared/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
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

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization({ permissions: [{ resource: Resources.users, action: Actions.read }] })
  @Get()
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiOkResponse({ description: 'Lista de usuários', type: [UserDto] })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para listar usuários' })
  async findAll(@Query('filter') filter:FilterDto) {
    return await this.userService.findAll(filter);
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar usuário (rota pública)' })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos (validação) ou e-mail já em uso' })
  async create(@Body() dto:CreateUserDto){
    return this.userService.create(dto).then((response)=>
      plainToClass(UserDto,response)
    )
  }

  @Authorization({ permissions: [{ resource: Resources.users, action: Actions.read }] })
  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Usuário não encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para visualizar usuário' })
  async findOne(@Param('id') id:string){
    return await this.userService.findOne(+id);
  }

  @Authorization({ permissions: [{ resource: Resources.users, action: Actions.update }] })
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Usuário não encontrado ou dados inválidos (ex.: e-mail já em uso)' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para atualizar usuário' })
  async update(@Param('id') id:string,@Body() dto:UpdateUserDto){
    return await this.userService.update(+id,dto);
  }

  @Authorization({ permissions: [{ resource: Resources.users, action: Actions.delete }] })
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Usuário excluído com sucesso' })
  @ApiBadRequestResponse({ description: 'Usuário não encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Sem permissão para excluir usuário' })
  async delete(@Param('id') id:string){
    return await this.userService.delete(+id);
  }

}