import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";

export class DetailsRobotColumn extends AggregateRootDto {
  @ApiProperty()
  @Expose()
  columnName: string;

  @ApiProperty()
  @Expose()
  dataType: string;

  @ApiProperty()
  @Expose()
  columnAlias: string;

  @ApiProperty()
  @Expose()
  isNullable: boolean;
}