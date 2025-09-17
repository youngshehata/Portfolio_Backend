import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@common/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body('password') password: string,
    @Session() session: Record<string, any>,
  ) {
    return this.authService.login(password, session);
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>) {
    return this.authService.logout(session);
  }

  @Get('logged')
  isLoggedIn(@Session() session: Record<string, any>) {
    const loggedIn = this.authService.isLoggedIn(session);
    if (!loggedIn) throw new UnauthorizedException('Not logged in');
    return true;
  }
}
