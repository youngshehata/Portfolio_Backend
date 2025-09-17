import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(password: string, session: Record<string, any>) {
    if (password === process.env.PASSWORD) {
      session.isOwner = true;
      return 'Logged in successfully';
    }
    throw new UnauthorizedException('Invalid password');
  }

  logout(session: Record<string, any>) {
    session.isOwner = false;
    session.destroy();
    return 'Logged out successfully';
  }

  isLoggedIn(session: Record<string, any>) {
    return session.isOwner;
  }
}
