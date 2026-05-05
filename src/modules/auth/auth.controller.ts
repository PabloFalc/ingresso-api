import { Controller, Get, Post } from '@nestjs/common';
import { Documented } from 'src/core/decorators/documented/route-doc.decorator';
import {
  authGetSession,
  authRefresh,
  authSignIn,
  authSignUp,
} from './schemas/auth-doc.schema';

// ! BETTER AUTH MODULE ROUTE DOCUMENTATION
@Controller({ path: 'api/auth' })
export class AuthController {
  constructor() {}

  @Documented(authSignUp)
  @Post('sign-up/email')
  async register() {}

  @Documented(authSignIn)
  @Post('sign-in/email')
  async login() {}

  @Documented(authRefresh)
  @Post('refresh')
  async refresh() {}

  @Documented(authGetSession)
  @Get('get-session')
  async getMe() {}
}
