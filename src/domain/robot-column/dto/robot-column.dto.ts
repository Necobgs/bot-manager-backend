import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";


export class RobotColumnDto extends AggregateRootDto {

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    columnName: string;

    @IsNotEmpty()
    @IsString()
    dataType: string;

    @IsNotEmpty()
    @IsString()
    columnAlias: string;

    @IsNotEmpty()
    @IsBoolean()
    isNullable: boolean;
}