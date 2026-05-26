import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from './domain/system/system.module';
import { RobotModule } from './domain/robot/robot.module';
import { CredentialModule } from './domain/credential/credential.module';
import { TaskModule } from './domain/task/task.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsertTaskStatus1753493718952 } from './migrations/1753493718952-insertTaskStatus';
import { UserModule } from './domain/user/user.module';
import { TaskStatusModule } from './domain/task_status/task_status.module';
import { PermissionModule } from './domain/permission/permission.module';
import { AuthModule } from './domain/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { InsertPermissions1760849854104 } from './migrations/1760849854104-InsertPermissions';
import { RobotColumnModule } from './domain/robot-column/robot-column.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'exports', 'example_workbooks'),
      serveRoot: "/example_workbooks"
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_RPA_PORT: Joi.number().required(),
        DB_RPA_HOST: Joi.string().required(),
        DB_RPA_USER: Joi.string().required(),
        DB_RPA_PASSW: Joi.string().required(),
        DB_RPA_DATABASE: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_RPA_HOST')!,
        port: +configService.get('DB_RPA_PORT')!,
        username: configService.get('DB_RPA_USER')!,
        password: configService.get('DB_RPA_PASSW')!,
        database: configService.get('DB_RPA_DATABASE')!,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        migrationsRun: false,
        migrations: [InsertTaskStatus1753493718952, InsertPermissions1760849854104],
      })
    }),
    SystemModule, RobotModule, CredentialModule, TaskModule, TaskStatusModule, UserModule, PermissionModule, AuthModule, RobotColumnModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }