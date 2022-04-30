import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ChangePasswordAuthDto } from './dto/change-password.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResetAuthDto } from './dto/reset-password.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('isVerified')
  checkIsVerifiedAccount(@Body() userId: string ) {
    return this.authService.checkIfIsVerifiedAccount(userId);
  }

  @Post('verify')
  verifyAccount(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.validateVerifyCode(verifyAuthDto);
  }

  @Post('reset')
  resetPasswordAccount(@Body() resetAuthDto: ResetAuthDto ) {
    return this.authService.resetPasswordAccount(resetAuthDto);
  }

  @Post('change-password')
  changePasswordAccount(@Body() changePasswordDto: ChangePasswordAuthDto) {
    return this.authService.changePasswordAccount(changePasswordDto);
  }

}
