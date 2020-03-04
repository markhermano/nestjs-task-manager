import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthSignUpCredentialsDto } from './dto/auth-signup-credentials.dto';
import { AuthSignInCredentialsDto } from './dto/auth-signin-credentials.dto';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
// import { GetUser } from './get-user.decorator';
// import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authSignUpCredentialsDto: AuthSignUpCredentialsDto): Promise<void> {
    return this.authService.signUp(authSignUpCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authSignInCredentialsDto: AuthSignInCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authSignInCredentialsDto);
  }

  // @Post('/test')
  // @UseGuards(AuthGuard())
  // test(@GetUser() user: User) {
  //   console.log(user);
  // }
}
