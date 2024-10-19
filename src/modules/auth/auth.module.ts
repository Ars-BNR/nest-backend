import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/users.module';
import { TokenModule } from '../token/token.module';
import { JWTStrategy } from 'src/strategy';

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
