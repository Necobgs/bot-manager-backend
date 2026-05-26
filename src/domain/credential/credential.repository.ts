import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../shared/base-repository";
import { Credential } from "./entities/credential.entity";
import { DataSource } from "typeorm";


@Injectable()
export class CredentialRepository extends BaseRepository<Credential>{
    constructor(dataSource:DataSource){
        super(Credential,dataSource)
    }
}