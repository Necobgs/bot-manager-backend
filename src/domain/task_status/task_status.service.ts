import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterDto } from '../shared/filter-dto';
import { TaskStatusRepository } from './task_status-repository';


@Injectable()
export class TaskStatusService {

  constructor(private readonly taskStatusRepository: TaskStatusRepository) { }

  async findAll() {
    return await this.taskStatusRepository.find({
      select: ['id', 'description', 'identifier']
    });
  }



  async findOne(id: number) {
    const taskStatus = await this.taskStatusRepository.findOneBy({ id });
    if (!taskStatus) throw new BadRequestException(`Cargo de id '${id}' não encontrado`)
    return taskStatus;
  }

  async findOneByIdentifier(identifier: string) {
    const taskStatus = await this.taskStatusRepository.findOneBy({ identifier });
    if (!taskStatus) throw new BadRequestException(`Cargo de identificador '${identifier}' não encontrado`)
    return taskStatus;
  }

}
