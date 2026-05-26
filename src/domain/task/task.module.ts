import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { RobotColumnRepository } from '../robot/robot-field.repository';
import { RobotModule } from '../robot/robot.module';
import { TaskRepository } from './task.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([Task]),
    RobotModule
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TaskModule {}
