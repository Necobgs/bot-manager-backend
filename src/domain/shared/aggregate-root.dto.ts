import { Exclude, Expose } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BaseEntityDto } from "./base-entity.dto";

@Exclude()
export abstract class AggregateRootDto extends BaseEntityDto {
  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  deletedAt: Date;
}