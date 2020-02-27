import { Repository, EntityRepository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthSignUpCredentialsDto } from './dto/auth-signup-credentials.dto';
import { AuthSignInCredentialsDto } from './dto/auth-signin-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authSignupCredentialsDto: AuthSignUpCredentialsDto): Promise<void> {
    const { username, password } = authSignupCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt =  await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch(error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authSignInCredentialsDto: AuthSignInCredentialsDto): Promise<string> {
    const { username, password } = authSignInCredentialsDto;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
