import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from 'src/common/public.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Public()
  @Post('login')
  async login(@Body() body: any) {
    if (!body.username || !body.password) {
      return {
        code: 400,
        msg: '参数错误',
      };
    }
    return this.adminService.login(body.username, body.password);
  }

  @Get('getUserInfo')
  async getUserInfo() {
    return this.adminService.getAllUsers();
  }

  @Get('getUserInfoById/:id')
  async getUserInfoById(@Param() params: any) {
    return this.adminService.getUserById(params.id);
  }

  @Post('addUser')
  async addUser(@Body() body: any) {
    return this.adminService.addUser(body);
  }

  @Put('updateUser/:id')
  async updateUser(@Param() params: any, @Body() body: any) {
    return this.adminService.updateUser(params.id, body);
  }

  @Post('deleteUser/:id')
  async deleteUser(@Param() params: any) {
    return this.adminService.deleteUser(params.id);
  }
}
