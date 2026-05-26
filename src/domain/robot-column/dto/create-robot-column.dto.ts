import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, ValidateIf } from "class-validator";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";


export class CreateRobotColumnDto extends AggregateRootDto {

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    attnum: number;

    @IsNotEmpty()
    @IsString()
    columnAlias: string;

    @IsNotEmpty()
    @IsBoolean()
    isImportable: boolean;

    @ValidateIf(o => o.isImportable === true)
    @IsString()
    @IsNotEmpty()
    headerImport?: string;
}