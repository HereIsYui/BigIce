import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PiUser } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request as ExpRequest } from 'express';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PiUser) private readonly pi_user: Repository<PiUser>,
    private readonly JwtService: JwtService,
  ) {}

  async signup(signupData: CreateAuthDto, req: ExpRequest) {
    console.log(signupData);
    console.log(req.ip);
    const findUser = await this.pi_user.findOne({
      where: { appid: signupData.appid },
    });
    if (findUser && findUser.appid === signupData.appid) return '用户已存在';
    signupData.secret = bcryptjs.hashSync(signupData.secret, 10);
    signupData.reg_ip = req.ip;
    await this.pi_user.save(signupData);
    return {
      msg: '注册成功',
    };
  }

  async getToken(loginData: any, req: ExpRequest) {
    console.log(loginData);
    if (!loginData.appid || !loginData.secret) {
      return new BadRequestException('参数错误');
    }
    const findUser = await this.pi_user.findOne({
      where: { appid: loginData.appid },
    });
    //let secret = randomBytes(64).toString('base64');
    // 没有找到
    if (!findUser) return new BadRequestException('appid不存在');
    // 找到了对比密码
    const compareRes: boolean = loginData.secret === findUser.secret;
    // 密码不正确
    if (!compareRes) return new BadRequestException('secret不正确');
    const payload = { appid: findUser.appid };
    findUser.login_ip = req.ip;
    await this.pi_user.update(findUser.id, { login_ip: findUser.login_ip });
    return {
      access_token: this.JwtService.sign(payload),
      app_name: findUser.appname,
    };
  }
}
