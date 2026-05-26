import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";
import { DetailsRobotColumn } from "../../robot-column/dto/details-robot-column";
import { SystemDto } from "src/domain/system/dto/system.dto";
import { CredentialDto } from "src/domain/credential/dto/credential.dto";

export class DetailsRobot extends AggregateRootDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  objective: string;

  @ApiProperty()
  @Expose()
  tableName: string;

  @ApiProperty()
  @Expose()
  createRepository: boolean;

  @ApiProperty()
  @Expose()
  createDocumentation: boolean;

  @ApiProperty({ type: [DetailsRobotColumn] })
  @Expose()
  columns: DetailsRobotColumn[];

  @ApiProperty({ type: [SystemDto] })
  @Expose()
  systems: SystemDto[];

  @ApiProperty({ type: [CredentialDto] })
  @Expose()
  credentials: CredentialDto[];
}