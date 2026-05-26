import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { FilterDto } from '../shared/filter-dto';
import { Filter } from '../shared/apply-filters';
import { RobotService } from '../robot/robot.service';
import { PermissionService } from '../permission/permission.service';
import { updateListById } from 'src/utils/update-list';
import { AuthorizationDecoratorArgs } from '../shared/authorization/authorization.decorator';


@Injectable()
export class UserService {

  constructor(
    private readonly repository: UserRepository,
    private readonly robotService: RobotService,
    private readonly permissionService: PermissionService
  ) { }

  async exists(filter: Filter) {
    return await this.repository.filterExists(filter);
  }

  async filterOne(filter: Filter) {
    return await this.repository.filterOne(filter);
  }

  async findAll(filter: FilterDto) {
    return await this.repository.filterAll(filter);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repository.findOne({
      where: { id },
      relations: {
        robot: true
      }, loadRelationIds: {
        relations: ["robot", "role"]
      }
    });
    if (!user) throw new BadRequestException("Usuário não encontrado");
    return user;
  }

  async findOneByAd(ad: string) {
    const user = await this.repository.findOne({
      where: { ad },
      select: {
        id: true,
        ad: true,
        email: true,
        robot: {
          id: true
        },
        permissions: {
          id: true,
          resource: true,
          action: true
        },
        password: true
      },
      relations: {
        robot: true,
        permissions: true
      },
    });
    if (!user) throw new BadRequestException("Usuário não encontrado")
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const emailExists = await this.exists({ email: dto.email });
    if (emailExists) {
      throw new BadRequestException(`Email ${dto.email} already in use`);
    }

    const user = new User();
    user.name = dto.name
    user.ad = dto.ad
    user.password = dto.password
    user.email = dto.email

    if (dto.robotsId && dto.robotsId.length > 0) {
      user.robot = await updateListById([], dto.robotsId, this.robotService.findOne)
    }

    return await this.repository.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {

    const user = await this.findOne(id);

    if (dto.ad) {
      user.ad = dto.ad
    }

    if (dto.email) {
      user.email = dto.email
    }

    if (dto.name) {
      user.name = dto.name
    }

    if (dto.robotsId && dto.robotsId.length >= 0) {
      user.robot = await updateListById(user.robot, dto.robotsId, this.robotService.findOne)
    }

    // if (dto.permissionsId && dto.permissionsId.length >= 0) {
    //   const permissions = await updateListById(user.permissions, dto.permissionsId, this.permissionService.findOne)
    //   const filterDto: FilterDto = { filter: { 'role.id': { '$eq': user.role.id } }, page: 1, limit: 100 }
    //   permissions.concat((await this.permissionService.findAll(filterDto)).items)
    //   user.permissions = permissions
    // }

    return await this.repository.save(user);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    return await this.repository.remove(user)
  }

  async hasPermissions(userId: number, args: AuthorizationDecoratorArgs) {
    if (!args || !args.permissions || args.permissions.length === 0) {
      return true;
    }

    const qb = this.repository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .andWhere('user.deleted_at IS NULL')
      .select('1');

    if (args.mode === 'any') {
      const orConditions = args.permissions.map((perm, index) => {
        return `EXISTS (
          SELECT 1
          FROM users_permissions up
          INNER JOIN permissions p ON p.id = up.permission_id
          WHERE up.user_id = "user"."id"
            AND p.resource = :resource_${index}
            AND p.action = :action_${index}
            AND p.deleted_at IS NULL
        )`;
      });
      const parameters = {};
      args.permissions.forEach((perm, index) => {
        parameters[`resource_${index}`] = perm.resource;
        parameters[`action_${index}`] = perm.action;
      });
      qb.andWhere(`(${orConditions.join(' OR ')})`, parameters);
    } else {
      args.permissions.forEach((perm, index) => {
        qb.andWhere(
          `
          EXISTS (
            SELECT 1
            FROM users_permissions up
            INNER JOIN permissions p ON p.id = up.permission_id
            WHERE up.user_id = "user"."id"
              AND p.resource = :resource_${index}
              AND p.action = :action_${index}
              AND p.deleted_at IS NULL
          )
          `,
          {
            [`resource_${index}`]: perm.resource,
            [`action_${index}`]: perm.action,
          },
        );
      });
    }

    return qb.getExists();
  }

}
