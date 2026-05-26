import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { applyFilters, Filter } from './apply-filters';
import {FilterDto } from './filter-dto'

export interface ResponseFilterMany<T extends ObjectLiteral> {
  items: T[];
  count: number;
  limit: number;
  page: number;
}

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  constructor(
    readonly target: EntityTarget<T>,
    dataSource: DataSource,
  ) {
    super(target, dataSource.manager);
  }

  async filterExists(filter: Filter,entities?:string[]): Promise<boolean> {
    return this.getFilteredQueryBuilder(filter,entities).getExists();
  }

  async filterOne(filter: Filter,entities?:string[]): Promise<T | null> {
    return (await this.getFilteredQueryBuilder(filter,entities).getOne()) ?? null;
  }

  async filterAll(filter: FilterDto,entities?:string[]) : Promise<ResponseFilterMany<T>> {
    const qb = await this.getFilteredQueryBuilder(filter,entities);
    return this.returnFilterAll(filter,qb)
  }

  async returnFilterAll(filter:FilterDto,qb:SelectQueryBuilder<T>){
    const [ items, count ] = await qb.getManyAndCount();
    return {
      items:items, 
      count:count,
      limit:filter!.limit,
      page:filter!.page
    };
  }

  getFilteredQueryBuilder(filter: FilterDto | Filter,entities?:string[]): SelectQueryBuilder<T> {
    let qb = this.manager.createQueryBuilder(this.target, 'entity');
    let limit = 10
    let page = 1 - 1
    let skip = limit * page
    qb = this.addRelations(qb,entities);
    if (filter){
      qb = applyFilters(qb, this.target, 'entity',filter instanceof FilterDto ? filter.filter : filter);
      if(filter instanceof FilterDto){
        limit = filter.limit ?? 10
        page = filter.page > 0 ? filter.page - 1 : filter.page
        skip = limit * page
      }
    }
    qb = qb.take(limit).skip(skip)
    return qb;
  }

  addRelations(qb: SelectQueryBuilder<T>,entities?:string[]): SelectQueryBuilder<T> {
    const metadata = this.manager.connection.getMetadata(this.target);
    metadata.relations
      .filter((relation) => 
        relation.isEager || entities?.includes(relation.propertyName)
      )
      .forEach((relation) => {
        qb.leftJoinAndSelect(
          `entity.${relation.propertyName}`,
          relation.propertyName,
        );
      });
    return qb;
  }
}