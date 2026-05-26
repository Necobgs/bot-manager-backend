import { Exclude, Expose } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";

@Exclude()
export class CredentialDto extends AggregateRootDto {
  @ApiPropertyOptional()
  @Expose()
  user: string;

  @ApiProperty()
  @Expose()
  password: string;

  @ApiPropertyOptional()
  @Expose()
  extraField: string;

  @ApiProperty()
  @Expose()
  activated: boolean;

  @ApiPropertyOptional()
  @Expose()
  lastUsedDate: Date;
}