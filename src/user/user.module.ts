import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { PiUser } from '../auth/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/contants';

@Module({
  imports: [TypeOrmModule.forFeature([User, PiUser]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {
      expiresIn: jwtConstants.expiresIn
    }
  })],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {

}
