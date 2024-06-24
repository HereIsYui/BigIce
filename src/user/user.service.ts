import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { PiUser } from '../auth/entities/auth.entity';
import { PointRecord } from './entities/point_record.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt/dist';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @InjectRepository(PiUser) private readonly piUser: Repository<PiUser>,
    @InjectRepository(PointRecord) private readonly pointRecord: Repository<PointRecord>,
    private readonly JwtService: JwtService,
  ) { }

  // login
  async login(username: string, password: string) {
    const user = await this.user.findOne({
      where: {
        username,
        password,
      },
    });
    if (user) {
      const payload = { username: user.username };
      const token = this.JwtService.sign(payload);

      return {
        code: 200,
        msg: '登录成功',
        access_token: token,
        data: {
          name: user.username,
          fish_id: user.fish_uid,
          openid: user.openid,
          nickname: user.nickname,
        },
      };
    } else {
      return { code: 400, msg: '登录失败' };
    }
  }
  async getAllUsers() {
    const users = await this.piUser.find();
    return { code: 200, msg: '查询成功', data: users };
  }
  async getUserById(openid: string) {
    const user = await this.user.findOne({
      where: {
        openid,
      },
    });
    if (user != null) {
      return {
        code: 200,
        msg: '查询成功',
        data: {
          name: user.username,
          fish_id: user.fish_uid,
          openid: user.openid,
          nickname: user.nickname,
        },
      };
    } else {
      return {
        code: 400,
        msg: '用户不存在',
        data: null,
      };
    }
  }
  // 更新用户积分
  async updateUserPoint(openid: string, point: number, reason: string) {
    const user = await this.user.findOne({
      where: { openid }
    })
    if (user == null) {
      return { code: 400, msg: '用户不存在' }
    } else {
      this.user.update(user.id, { point: user.point + point })
      const newPointRecord = this.pointRecord.create({
        uid: user.fish_uid,
        point: point,
        reason: reason
      });
      this.pointRecord.save(newPointRecord);
      return { code: 200, msg: '更新成功' }
    }
  }

  async addUser(user: User) {
    if (!user.username || !user.password) {
      return { code: 400, msg: '用户名或密码不能为空' };
    }
    const userExist = await this.user.findOne({
      where: {
        username: user.username,
      },
    });
    if (userExist) {
      return { code: 400, msg: '用户名已存在' };
    }
    user.openid = randomBytes(18).toString('hex');
    const newUser = await this.user.save(user);
    return { code: 200, msg: '添加成功', data: newUser };
  }
  async deleteUser(id: number) {
    const user = await this.user.findOne({ where: { id: id } });
    if (!user) {
      return { code: 400, msg: '用户不存在' };
    }
    await this.user.update(id, {
      delete_flag: '1',
    });
    return { code: 200, msg: '删除成功' };
  }
  async updateUser(id: number, user: User) {
    const oldUser = await this.user.findOne({
      where: { id: id },
    });
    if (!oldUser) {
      return {
        code: 400,
        msg: '用户不存在',
      };
    }
    if (!user.username || !user.password) {
      return {
        code: 400,
        msg: '用户名或密码不能为空',
      };
    }
    const userExist = await this.user.findOne({
      where: {
        username: user.username,
        id: Not(id),
      },
    });
    if (userExist) {
      return {
        code: 400,
        msg: '用户名已存在',
      };
    }
    const newUser = await this.user.update(id, user);
    return { code: 200, msg: '修改成功', data: newUser };
  }
}
