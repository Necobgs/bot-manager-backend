import { Exclude, Expose } from "class-transformer";
import { Credential } from "src/domain/credential/entities/credential.entity";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";
import { System } from "src/domain/system/entities/system.entity";


@Exclude()
export class RobotDto extends AggregateRootDto {

    @Expose()
    name: string;

    @Expose()
    objective: string;

    @Expose()
    activated: boolean;

    @Expose()
    system: System[];

    @Expose()
    credential: Credential[];

    @Expose()
    exampleWorkbook: string;

}