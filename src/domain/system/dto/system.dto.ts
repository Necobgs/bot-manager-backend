import { Exclude, Expose } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";

@Exclude()
export class SystemDto extends AggregateRootDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  url: string;
}