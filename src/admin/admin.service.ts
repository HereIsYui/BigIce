import { Injectable } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { PiUser } from '../auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly admin: Repository<Admin>,
    @InjectRepository(PiUser) private readonly piUser: Repository<PiUser>,
    private readonly JwtService: JwtService,
  ) {}

  // login
  async login(username: string, password: string) {
    const admin = await this.admin.findOne({
      where: {
        username,
        password,
      },
    });
    if (admin) {
      const payload = { username: admin.username };
      const token = this.JwtService.sign(payload);
      return { code: 200, msg: '登录成功', access_token: token, data: admin };
    } else {
      return { code: 400, msg: '登录失败' };
    }
  }
  async getAllUsers() {
    const users = await this.piUser.find();
    return { code: 200, msg: '查询成功', data: users };
  }
  async getUserById(id: number) {
    const user = await this.piUser.findOne({
      where: {
        id,
      },
    });
    return { code: 200, msg: '查询成功', data: user };
  }
  async addUser(user: PiUser) {
    if (!user.appid || !user.appid) {
      return { code: 400, msg: '用户名或密码不能为空' };
    }
    const userExist = await this.piUser.findOne({
      where: {
        appid: user.appid,
      },
    });
    if (userExist) {
      return { code: 400, msg: '用户名已存在' };
    }
    const newUser = await this.piUser.save(user);
    return { code: 200, msg: '添加成功', data: newUser };
  }
  async deleteUser(id: number) {
    const user = await this.piUser.findOne({ where: { id: id } });
    if (!user) {
      return { code: 400, msg: '用户不存在' };
    }
    await this.piUser.delete(id);
    return { code: 200, msg: '删除成功' };
  }
  async updateUser(id: number, user: PiUser) {
    const oldUser = await this.piUser.findOne({
      where: { id: id },
    });
    if (!oldUser) {
      return {
        code: 400,
        msg: '用户不存在',
      };
    }
    if (!user.appid || !user.secret) {
      return {
        code: 400,
        msg: '用户名或密码不能为空',
      };
    }
    const userExist = await this.piUser.findOne({
      where: {
        appid: user.appid,
        id: Not(id),
      },
    });
    if (userExist) {
      return {
        code: 400,
        msg: '用户名已存在',
      };
    }
    const newUser = await this.piUser.update(id, user);
    return { code: 200, msg: '修改成功', data: newUser };
  }
}
