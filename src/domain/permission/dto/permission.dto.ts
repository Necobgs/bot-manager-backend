import { Exclude, Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AggregateRootDto } from "src/domain/shared/aggregate-root.dto";


@Exclude()
export class PermissionDto extends AggregateRootDto{

    @ApiProperty({ description: 'Recurso da permissão' })
    @Expose()
    resource:string;

    @ApiProperty({ enum: ['create', 'read', 'update', 'delete'], description: 'Ação da permissão' })
    @Expose()
    action: 'create' | 'read' | 'update' | 'delete';

}