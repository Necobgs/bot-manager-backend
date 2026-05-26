import { Module } from '@nestjs/common';
import { TaskStatusService } from './task_status.service';
import { TaskStatusController } from './task_status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStatus } from './entities/task_status.entity';
import { TaskStatusRepository } from './task_status-repository';

@Module({
  imports:[TypeOrmModule.forFeature([TaskStatus])],
  controllers: [TaskStatusController],
  providers: [TaskStatusService,TaskStatusRepository],
})
export class TaskStatusModule {}