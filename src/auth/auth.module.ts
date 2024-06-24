import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { PiUser } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { adminJwtConstants } from './contants';
import JwtAuthStrategy from './jwt-auth.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([PiUser]), JwtModule.register({
    secret: adminJwtConstants.secret,
    signOptions: {
      expiresIn: adminJwtConstants.expiresIn
    }
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy]
})
export class AuthModule { }
