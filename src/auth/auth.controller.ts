import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request as ExpRequest } from 'express';
import { Public } from 'src/common/public.decorator';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post("/signup")
  signup(@Body() signupData: CreateAuthDto, @Request() req: ExpRequest) {
    return this.authService.signup(signupData, req);
  }

  @Public()
  @Post("/getToken")
  login(@Body() loginData: any, @Request() req: ExpRequest) {
    return this.authService.getToken(loginData, req);
  }
}
