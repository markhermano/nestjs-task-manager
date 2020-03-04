import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.respository';
import { AuthSignUpCredentialsDto } from './dto/auth-signup-credentials.dto';
import { AuthSignInCredentialsDto } from './dto/auth-signin-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authSignUpCredentialsDto: AuthSignUpCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authSignUpCredentialsDto);
  }

  async signIn(authSignInCredentialsDto: AuthSignInCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(authSignInCredentialsDto);
    
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
    return { accessToken };
  }
}
