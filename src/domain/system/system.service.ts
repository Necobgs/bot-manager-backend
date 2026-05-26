import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSystemDto } from './dto/create-system.dto';
import { Filter } from '../shared/apply-filters';
import { SystemRepository } from './system.repository';
import { FilterDto } from '../shared/filter-dto';
import { UpdateSystemDto } from './dto/update-system.dto';


@Injectable()
export class SystemService {

  constructor(private readonly systemRepository:SystemRepository){}

  async exists(filter:Filter){
    return this.systemRepository.filterExists(filter);
  }

  async create(dto: CreateSystemDto) {
    const systemExists = await this.exists({name:dto.name})

    if(systemExists) throw new BadRequestException(`System ${dto.name} is already register`)
    
    const system = this.systemRepository.create(dto)
    return await this.systemRepository.save(system);
  }

  async findOne(id:number){
    const system = await this.systemRepository.findOneBy({id});
    if(!system) throw new BadRequestException(`Sistema de id '${id}' não encontrado`)
    return system;
    
  }

  async update(id:number,dto:UpdateSystemDto){
    const system = await this.findOne(id);
    const updatedSystem  = this.systemRepository.merge(system,dto);
    return await this.systemRepository.save(updatedSystem)
  }

  async findAll(filter:FilterDto) {
    return await this.systemRepository.filterAll(filter);
  }

  async delete(id:number){
    const system = await this.findOne(id);
    return await this.systemRepository.remove(system);
  }
}