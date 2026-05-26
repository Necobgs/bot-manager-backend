import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './entities/task.entity';
import { FilterDto } from '../shared/filter-dto';
import { RobotColumnRepository } from '../robot/robot-field.repository';
import { User } from '../user/entities/user.entity';
import { Robot } from '../robot/entities/robot.entity';

export interface CreateTaskResult {
  task: Task;
  warnings?: string[];
}

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly robotColumnRepository: RobotColumnRepository,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) { }

  /**
   * Converte objeto coluna→array em array de linhas (registros).
   * Ex.: { a: [1,2], b: ['x','y'] } → [ { a: 1, b: 'x' }, { a: 2, b: 'y' } ]
   */
  private columnOrientedToRows(data: Record<string, unknown[]>): Record<string, unknown>[] {
    const keys = Object.keys(data);
    if (keys.length === 0) return [];

    const lengths = keys.map((k) => (data[k] ?? []).length);
    const len = lengths[0];
    if (lengths.some((l) => l !== len)) {
      throw new BadRequestException(
        'Todas as colunas do objeto "data" devem ter o mesmo número de elementos (linhas).',
      );
    }

    const rows: Record<string, unknown>[] = [];
    for (let i = 0; i < len; i++) {
      const row: Record<string, unknown> = {};
      for (const k of keys) {
        row[k] = (data[k] as unknown[])[i];
      }
      rows.push(row);
    }
    return rows;
  }

  /**
   * Converte um valor para o tipo da coluna (dataType do PostgreSQL).
   * Lança BadRequestException se não for possível converter.
   */
  private convertValue(
    value: unknown,
    dataType: string,
    columnHeader: string,
    lineNumber: number,
  ): unknown {
    if (value === null || value === undefined) {
      return null;
    }

    const normalizedType = (dataType || '').toLowerCase();

    switch (normalizedType) {
      case 'int4':
      case 'int':
      case 'integer': {
        const n = Number(value);
        if (Number.isNaN(n) || !Number.isInteger(n)) {
          throw new BadRequestException(
            `Linha ${lineNumber}, coluna "${columnHeader}": valor "${value}" não pode ser convertido para inteiro.`,
          );
        }
        return n;
      }
      case 'int8':
      case 'bigint': {
        const n = Number(value);
        if (Number.isNaN(n) || !Number.isInteger(n)) {
          throw new BadRequestException(
            `Linha ${lineNumber}, coluna "${columnHeader}": valor "${value}" não pode ser convertido para bigint.`,
          );
        }
        return n;
      }
      case 'numeric':
      case 'decimal':
      case 'real':
      case 'float4':
      case 'float8':
      case 'double precision': {
        const n = Number(value);
        if (Number.isNaN(n)) {
          throw new BadRequestException(
            `Linha ${lineNumber}, coluna "${columnHeader}": valor "${value}" não pode ser convertido para número.`,
          );
        }
        return n;
      }
      case 'bool':
      case 'boolean': {
        if (typeof value === 'boolean') return value;
        const s = String(value).toLowerCase();
        if (['true', '1', 'sim', 's', 'yes', 'y'].includes(s)) return true;
        if (['false', '0', 'não', 'nao', 'n', 'no'].includes(s)) return false;
        throw new BadRequestException(
          `Linha ${lineNumber}, coluna "${columnHeader}": valor "${value}" não pode ser convertido para booleano.`,
        );
      }
      case 'date': {
        const d = value instanceof Date ? value : new Date(String(value));
        if (Number.isNaN(d.getTime())) {
          throw new BadRequestException(
            `Linha ${lineNumber}, coluna "${columnHeader}": valor "${value}" não é uma data válida.`,
          );
        }
        return d;
      }
      case 'timestamp':
      case 'timestamptz':
      case 'timestamp with time zone':
      case 'timestamp without time zone': {
        const d = value instanceof Date ? value : new Date(String(value));
        if (Number.isNaN(d.getTime())) {
          throw new BadRequestException(
            `Linha ${lineNumber}, coluna "${columnHeader}": valor "${value}" não é um timestamp válido.`,
          );
        }
        return d;
      }
      case 'varchar':
      case 'char':
      case 'character varying':
      case 'text':
      default:
        return String(value);
    }
  }

  async create(dto: CreateTaskDto, user: User): Promise<CreateTaskResult> {
    const warnings: string[] = [];

    // 1) Buscar colunas do robô (com relação robot para tableName)
    const columns = await this.robotColumnRepository.find({
      where: { robot: { id: dto.idRobot } },
      relations: ['robot'],
      order: { attnum: 'ASC' },
    });

    if (!columns.length) {
      throw new NotFoundException(
        `Nenhuma coluna encontrada para o robô com id ${dto.idRobot}.`,
      );
    }

    const robot = columns[0].robot as Robot;
    if (!robot?.tableName) {
      throw new BadRequestException(
        `O robô (id ${dto.idRobot}) não possui tableName configurada.`,
      );
    }

    const importableColumns = columns.filter((c) => c.isImportable);
    
    if (importableColumns.length === 0) {
      throw new BadRequestException(
        `O robô (id ${dto.idRobot}) não possui colunas configuradas como importáveis. Atualize o robô definindo 'isImportable: true' nas colunas desejadas.`,
      );
    }

    const requiredColumns = importableColumns.filter((c) => !c.isNullable);

    // 2) Normalizar data para array de linhas
    const rows = this.columnOrientedToRows(dto.data);
    const dataHeaders = Object.keys(dto.data);

    // 3) Colunas do payload que não existem nos fields do robô → warning
    const validHeaders = new Set(
      importableColumns
        .map((c) => c.headerImport ?? c.columnName)
        .filter((h): h is string => !!h),
    );
    for (const h of dataHeaders) {
      if (!validHeaders.has(h)) {
        warnings.push(
          `Coluna "${h}" não está mapeada nos fields importáveis (via headerImport ou columnName) do robô e foi ignorada.`,
        );
      }
    }

    // 4) Campo obrigatório ausente no payload → exceção
    for (const col of requiredColumns) {
      const header = col.headerImport ?? col.columnName;
      if (!dataHeaders.includes(header)) {
        throw new BadRequestException(
          `Coluna obrigatória "${header}" não está presente nos dados enviados.`,
        );
      }
    }

    // 5) Validar e converter cada linha; montar registros para INSERT
    const insertRows: Record<string, unknown>[] = [];

    for (let i = 0; i < rows.length; i++) {
      const lineNumber = i + 1;
      const row = rows[i];
      const record: Record<string, unknown> = {};

      for (const col of importableColumns) {
        const header = col.headerImport ?? col.columnName;
        const raw = row[header];

        if (raw === null || raw === undefined || raw === '') {
          if (!col.isNullable) {
            throw new BadRequestException(
              `Linha ${lineNumber}: o campo obrigatório "${header}" está nulo ou vazio.`,
            );
          }
          record[col.columnName] = null;
          continue;
        }

        try {
          record[col.columnName] = this.convertValue(
            raw,
            col.dataType,
            header,
            lineNumber,
          );
        } catch (e) {
          if (e instanceof BadRequestException) throw e;
          throw new BadRequestException(
            `Linha ${lineNumber}, coluna "${header}": erro ao converter valor.`,
          );
        }
      }
      insertRows.push(record);
    }

    // 6) Inserir na tabela do robô (usando table_name)
    if (insertRows.length > 0) {
      const tableName = robot.tableName;
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(tableName)
        .values(insertRows)
        .execute();
    }

    // 7) Criar e salvar a task (sempre status id 1)
    const task: Task = this.taskRepository.create({
      importedBy: { id: user.id },
      robot: { id: dto.idRobot },
      scheduleInit: dto.scheduleInit ?? undefined,
      taskStatus: { id: 1 },
      observation: dto.observation ?? undefined,
      qtyTotal: rows.length,
      qtyError: 0,
      qtySuccess: rows.length,
      qtyDone: 0,
    });

    const savedTask = await this.taskRepository.save(task);

    const result: CreateTaskResult = { task: savedTask };
    if (warnings.length > 0) result.warnings = warnings;
    return result;
  }

  async findAll(dto: FilterDto) {
    return await this.taskRepository
      .getFilteredQueryBuilder(dto)
      .leftJoinAndSelect('entity.task_status', 'status')
      .getMany();
  }

  async findOneBy<K extends keyof Task>(by: K, value: Task[K]) {
    const task = await this.taskRepository.findOneBy({ [by]: value });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  async remove(id: number) {
    const task = await this.findOneBy('id', id);
    return await this.taskRepository.softRemove(task);
  }
}
