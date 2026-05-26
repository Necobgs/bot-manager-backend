import { Module } from "@nestjs/common";
import { RobotColumnService } from "./robot-column.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RobotColumn } from "./entities/robot-column.entity";


@Module({
    imports:[TypeOrmModule.forFeature([RobotColumn])],
    providers:[RobotColumnService],
    exports:[RobotColumnService]
})
export class RobotColumnModule{};