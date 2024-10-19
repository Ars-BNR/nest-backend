import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { CreateUserDTO } from '../user/dto';
import { AppError } from 'src/common/constants/errors';
import { UserLoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { AuthUserResponse } from './response';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      const existUser = await this.userService.findUserByEmail(dto.email);
      if (existUser) throw new BadRequestException(AppError.USER_EXIST);
      return this.userService.createUser(dto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async loginUser(dto: UserLoginDto): Promise<AuthUserResponse> {
    try {
      const existUser = await this.userService.findUserByEmail(dto.email);
      if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST);
      const validatePassword = await bcrypt.compare(
        dto.password,
        existUser.password,
      );
      if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA);

      const user = await this.userService.publicUser(dto.email);
      const token = await this.tokenService.generateJWTToken(user);
      return { user, token };
    } catch (error) {
      throw new Error(error);
    }
  }
}
