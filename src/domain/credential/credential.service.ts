import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialRepository } from './credential.repository';
import { FilterDto } from '../shared/filter-dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';


@Injectable()
export class CredentialService {

  constructor(private readonly credentialRepository:CredentialRepository){}

  async create(dto: CreateCredentialDto) {
    const credential = this.credentialRepository.create(dto);
    return await this.credentialRepository.save(credential);
  }

  async findAll(filter:FilterDto) {
    return await this.credentialRepository.filterAll(filter);
  }

  async update(id:number,dto:UpdateCredentialDto){
    const credential = await this.findOne(id);
    const updatedCredential = this.credentialRepository.merge(credential,dto);
    return await this.credentialRepository.save(updatedCredential)
  }

  async findOne(id:number){
    const credencial = await this.credentialRepository.findOneBy({id});
    if(!credencial) throw new BadRequestException(`Credêncial '${id}' não encontrado`)
    return credencial;
  }

  async delete(id:number){
    const credential = await this.findOne(id);
    return await this.credentialRepository.remove(credential);
  }
}
