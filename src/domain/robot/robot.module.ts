import { Module } from '@nestjs/common';
import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Robot } from './entities/robot.entity';
import { RobotRepository } from './robot.repository';
import { RobotColumn } from '../robot-column/entities/robot-column.entity';
import { RobotColumnRepository } from './robot-field.repository';
import { PermissionModule } from '../permission/permission.module';
import { SystemModule } from '../system/system.module';
import { CredentialModule } from '../credential/credential.module';
import { RobotColumnModule } from '../robot-column/robot-column.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Robot,RobotColumn]),
    PermissionModule,
    SystemModule,
    CredentialModule,
    RobotColumnModule
  ],
  controllers: [RobotController],
  providers: [RobotService,RobotRepository,RobotColumnRepository],
  exports:[RobotService,RobotColumnRepository]
})
export class RobotModule {}
