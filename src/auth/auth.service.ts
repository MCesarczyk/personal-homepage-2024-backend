import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { compare } from 'bcrypt';

import { UserService } from '../user/user.service';
import { jwtConstants } from '../auth/constants';
import { LoginResponse } from '../auth/entities/loginResponse.entity';
import { SignInDto } from '../auth/dto/signIn.dto';
import { UserData } from '../user/entities/userData.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async createAccessToken(userId: string): Promise<string> {
    return this.jwtService.sign(
      { id: userId },
      { expiresIn: jwtConstants.accessExpiration },
    );
  }

  async createRefreshToken(userId: string): Promise<string> {
    const tokenId = randomUUID();
    return this.jwtService.sign(
      { id: userId, tokenId },
      { expiresIn: jwtConstants.refreshExpiration },
    );
  }

  async login(signInDto: SignInDto): Promise<LoginResponse> {
    const user = await this.userService.getUser({
      email: signInDto.email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await compare(signInDto.password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.createAccessToken(user.id);
    const refreshToken = await this.createRefreshToken(user.id);

    const { email: userEmail } = await this.userService.updateUser({
      where: { id: user.id },
      data: { refreshToken },
    });

    console.log(`${userEmail} has been logged in`);

    return { accessToken, refreshToken };
  }

  async getProfile(
    accessToken: string | undefined,
  ): Promise<UserData | undefined> {
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const { id } = this.jwtService.verify(accessToken);

    const user = await this.userService.getUser({ id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return (await this.userService.getUser({ id: user.id })) || undefined;
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id } = this.jwtService.verify(refreshToken);

    const user = await this.userService.getUser({ id });

    if (user?.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.createAccessToken(user.id);
    const newRefreshToken = await this.createRefreshToken(user.id);

    await this.userService.updateUser({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(accessToken: string | undefined): Promise<UserData | undefined> {
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const { id } = this.jwtService.verify(accessToken);

    const user = await this.userService.getUser({ id });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    await this.userService.updateUser({
      where: { id: user.id },
      data: { refreshToken: null },
    });

    return user;
  }
}
