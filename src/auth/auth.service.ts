import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { env } from 'process';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signUpLocal(dto: AuthDto): Promise<Tokens> {
    const hashedPassword = await this.hashData(dto.password);

    const user = await this.prisma.users.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (user)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    const newUser = await this.prisma.users.create({
      data: {
        email: dto.email,
        hashedPassword,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signInLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Incorrect email or password');

    const isPasswordsMatches = await bcrypt.compare(
      dto.password,
      user.hashedPassword,
    );

    if (!isPasswordsMatches)
      throw new ForbiddenException('Incorrect email or password');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.users.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException('Access Denied');

    const isRtMatches = await bcrypt.compare(rt, user.hashedRefreshToken);

    if (!isRtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: string, rt: string) {
    const hashedRt = await this.hashData(rt);

    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRt,
      },
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: env.JWT_ACCESS_SECRET,

          expiresIn: 60 * 15,
        },
      ),

      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: env.JWT_REFRESH_SECRET,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
