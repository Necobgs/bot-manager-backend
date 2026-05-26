import { IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Dados no formato coluna → array de valores (uma coluna por chave).
 * Ex.: { "coluna1": ["linha1", "linha2"], "coluna2": ["a", "b"] }
 */
export class CreateTaskDto {

    @ApiProperty({
        description: 'Objeto com chaves = cabeçalhos (colunas) e valores = array de valores por linha. Ex.: { "coluna1": ["linha1","linha2"], "coluna2": ["a","b"] }',
        example: { coluna1: ['linha1', 'linha2'], coluna2: ['valor1', 'valor2'] },
    })
    @IsNotEmpty()
    @IsObject()
    data: Record<string, unknown[]>;

    @ApiProperty({ description: 'ID do robô que define as colunas da importação', example: 1, minimum: 1 })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    idRobot: number;

    @ApiPropertyOptional({ description: 'Data/hora agendada para início da tarefa' })
    @IsOptional()
    @IsDateString({}, { message: 'O campo scheduleInit deve ser uma data ou string de data válida (ISO 8601)' })
    scheduleInit: string | Date;

    @ApiPropertyOptional({ description: 'Observação sobre a tarefa' })
    @IsOptional()
    @IsString()
    observation: string;

}