import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/common/public.decorator';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post('login')
  async login(@Body() body: any) {
    if (!body.username || !body.password) {
      return {
        code: 400,
        msg: '参数错误',
      };
    }
    return this.userService.login(body.username, body.password);
  }

  @Get('getUserInfo')
  async getUserInfo() {
    return this.userService.getAllUsers();
  }

  @Get('getUser/:openid')
  async getUserInfoById(@Param() params: any) {
    if (!params.openid) {
      return {
        code: 400,
        msg: '参数错误',
      };
    }
    return this.userService.getUserById(params.openid);
  }

  @Post('editUserPoint')
  async editUserPoint(@Body() body: any) {
    if (!body.uid || !body.point || !body.reason) {
      return {
        code: 400,
        msg: '参数错误',
      };
    }
    return this.userService.updateUserPoint(body.uid, body.point, body.reason);
  }

  @Post('addUser')
  async addUser(@Body() body: any) {
    return this.userService.addUser(body);
  }

  @Put('updateUser/:id')
  async updateUser(@Param() params: any, @Body() body: any) {
    return this.userService.updateUser(params.id, body);
  }

  @Post('deleteUser/:id')
  async deleteUser(@Param() params: any) {
    return this.userService.deleteUser(params.id);
  }
}
