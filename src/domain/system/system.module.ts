import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { System } from './entities/system.entity';
import { SystemRepository } from './system.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([System])],
  controllers: [SystemController],
  providers: [SystemService,SystemRepository],
  exports:[SystemService]
})
export class SystemModule {}
