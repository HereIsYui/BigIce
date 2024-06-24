import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from './entities/admin.entity';
import { PiUser } from '../auth/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { adminJwtConstants } from '../auth/contants';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, PiUser]), JwtModule.register({
    secret: adminJwtConstants.secret,
    signOptions: {
      expiresIn: adminJwtConstants.expiresIn
    }
  })],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {

}
