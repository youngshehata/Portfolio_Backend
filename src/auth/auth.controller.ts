import { Body, Controller, Post, Session } from '@nestjs/common';
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
}
