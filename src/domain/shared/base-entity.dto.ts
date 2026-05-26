import { Exclude, Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export abstract class BaseEntityDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;
}