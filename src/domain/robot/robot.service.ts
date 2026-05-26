import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRobotDto } from './dto/create-robot.dto';
import { RobotRepository } from './robot.repository';
import { FilterDto } from '../shared/filter-dto';
import { RobotColumnRepository } from './robot-field.repository';
import { CredentialService } from '../credential/credential.service';
import { SystemService } from '../system/system.service';
import { UpdateRobotDto } from './dto/update-robot.dto';
import { Robot } from './entities/robot.entity';
import { RobotColumn } from '../robot-column/entities/robot-column.entity';
import { write, WorkBook, WritingOptions, utils } from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateRobotColumnDto } from '../robot-column/dto/create-robot-column.dto';
import { RobotColumnService } from '../robot-column/robot-column.service';


@Injectable()
export class RobotService {

  constructor(
    private readonly robotRepository: RobotRepository,
    private readonly robotColumnRepository: RobotColumnRepository,
    private readonly credentialService: CredentialService,
    private readonly systemService: SystemService,
    private readonly robotColumnService: RobotColumnService,
    @InjectDataSource() private readonly dataSource: DataSource
  ) { }

  async create(dto: CreateRobotDto) {

    let robot = this.robotRepository.create({
      name: dto.name,
      objective: dto.objective,
    });
    robot = await this.robotRepository.save(robot);

    if (dto.columns || dto.tableName) await this.associateColumns(dto, robot)

    if (dto.createDocumentation) {/* Criar documentação no confluence  */ }

    if (dto.createRepository) { /* Criar repositório no gitlab */ }

    if (dto.systems) {
      await Promise.all(dto.systems.map(async (systemId) => {
        const system = await this.systemService.findOne(systemId);
        robot.system.push(system)
      }))
    }

    if (dto.credentials) {
      await Promise.all(dto.credentials.map(async (credentialId) => {
        const credential = await this.credentialService.findOne(credentialId);
        robot.credential.push(credential)
      }))
    }
    const result = await this.robotRepository.save(robot);
    return this.findOne(result.id);
  }

  async findAll(filter: FilterDto) {
    return await this.robotRepository.filterAll(filter);
  }

  async findOne(id: number) {
    const robot = await this.robotRepository.findOne({
      where: { id },
      relations: ['columns']
    });
    if (!robot) throw new BadRequestException(`Robô de id '${id}' não encontrado`)
    return robot;
  }

  async update(id: number, dto: UpdateRobotDto) {
    const robot = await this.findOne(id);

    this.robotRepository.merge(robot, {
      name: dto.name ?? robot.name,
      objective: dto.objective ?? robot.objective,
    });

    if (dto.columns || dto.tableName) await this.associateColumns(dto, robot)

    if (dto.createDocumentation) {/* Criar documentação no confluence  */ }

    if (dto.createRepository) { /* Criar repositório no gitlab */ }

    if (dto.systems) await this.associateSystems(robot, dto.systems);
    if (dto.credentials) await this.associateCredentials(robot, dto.credentials);
    const robotUpdated = await this.robotRepository.save(robot)
    return this.findOne(robotUpdated.id);

  }

  async validateTableConnection(tableName: string) {
    const tableExists = await this.robotColumnService.tableExists(tableName)
    if (!tableExists) throw new BadRequestException(`A tabela '${tableName}' não existe`)
  }

  async getColumnsDataByTableName(tableName: string) {
    return await this.robotColumnService.getColumnFromTable(tableName)
  }

  async getUpdatedColumns(robotColumnsDto: CreateRobotColumnDto[], robot: Robot, schemaColumns: RobotColumn[]) {

    const robotColumnsUpdated: RobotColumn[] = [];

    await Promise.all(
      robotColumnsDto.map(async robotColumnDto => {

        // encontrar index pra fazer find e remove
        const schemaColumnIndex = schemaColumns.findIndex(schemaColumn => schemaColumn.attnum === robotColumnDto.attnum)

        // -1 = não encontrado
        if (schemaColumnIndex === -1) throw new BadRequestException(`Não foi possível encontrar a chave '${robotColumnDto.attnum}'`)

        const [schemaColumn] = schemaColumns.splice(schemaColumnIndex, 1)

        // O alias pode ser definido, o resto mantem como vem do schema
        const robotColumn =
          robot.columns?.find(col => col.attnum === robotColumnDto.attnum) ??
          this.robotColumnRepository.create();

        robotColumn.columnAlias = robotColumnDto.columnAlias;
        robotColumn.isImportable = robotColumnDto.isImportable;
        robotColumn.headerImport = robotColumnDto.headerImport;
        robotColumn.dataType = schemaColumn.dataType;
        robotColumn.columnName = schemaColumn.columnName;
        robotColumn.isNullable = schemaColumn.isNullable;
        robotColumn.attnum = schemaColumn.attnum;
        robotColumn.robot = robot;
        robotColumnsUpdated.push(robotColumn);

      })
    )

    if (schemaColumns.length !== 0) {
      throw new BadRequestException('Forneça todas as colunas')
    };

    return robotColumnsUpdated
  }

  async createExampleWorkbook(robotField: RobotColumn[] | CreateRobotColumnDto[], robot: Robot) {
    const sheetData = [
      robotField.map((field) => field.columnName) // header
    ];

    const worksheet = utils.aoa_to_sheet(sheetData);

    const data: WorkBook = {
      SheetNames: ['Aba 1'],
      Sheets: {
        'Aba 1': worksheet
      }
    }
    const filename = `${robot.tableName}.xlsx`;
    const filePath = path.resolve(process.cwd(), 'exports', 'example_workbooks', filename);
    const opts: WritingOptions = {
      type: 'buffer',
      bookType: 'xlsx',
    }
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const buffer = write(data, opts);
    fs.writeFileSync(filePath, buffer);
    robot.exampleWorkbook = filename;
  }

  private async associateColumns(dto: CreateRobotDto | UpdateRobotDto, robot: Robot) {
    if (!dto.columns || !dto.tableName) {
      throw new BadRequestException(
        'Forneça tanto o nome da tabela quanto os dados das colunas.'
      )
    };

    // valida tabela
    await this.validateTableConnection(dto.tableName);

    // setar nome da tabela no robot antes de operar colunas
    robot.tableName = dto.tableName;

    const schemaColumns = await this.getColumnsDataByTableName(dto.tableName);

    // Setar os registros atualizados e/ou novos
    robot.columns = await this.getUpdatedColumns(dto.columns, robot, schemaColumns);


    // Criar planilha modelo de importação
    await this.createExampleWorkbook(dto.columns, robot);
  }

  private async associateSystems(robot: Robot, systemIds: number[]) {
    robot.system = await Promise.all(
      systemIds.map(async (systemId) => {
        const system = await this.systemService.findOne(systemId);
        if (!system) throw new BadRequestException(`Sistema de id '${systemId}' não encontrado`);
        return system;
      })
    );
  }

  private async associateCredentials(robot: Robot, credentialIds: number[]) {
    robot.credential = await Promise.all(
      credentialIds.map(async (credentialId) => {
        const credential = await this.credentialService.findOne(credentialId);
        if (!credential) throw new BadRequestException(`Credencial de id '${credentialId}' não encontrada`);
        return credential;
      })
    );
  }
}