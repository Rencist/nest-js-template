import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../../dto/auth/auth.dto';
import { UserDto } from '../../dto/auth/user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { Login_Attempt, User } from '@prisma/client';
import { ThereIsAnErrorException } from 'src/exceptions/exception';
const SALT_PASSWORD = 12;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(LoginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: LoginDto.email,
      },
      include: {
        loginAttempt: true,
      },
    });

    if (!user)
      throw new UnauthorizedException('Username / Passoword not valid');

    //cek login attempt
    const _cekAttempt = await this.cekAttempt(user);
    if (!_cekAttempt.status)
      throw new HttpException(
        `Terlalu banyak mencoba. Tunggu ${_cekAttempt.second} detik untuk mencoba kembali.`,
        429,
      );

    // compare passwords
    const areEqual = await compare(LoginDto.password, user.password);
    if (!areEqual)
      throw new UnauthorizedException('Username / Passoword not valid');

    // reset login attempt
    await this.prisma.login_Attempt.update({
      where: {
        userId: user.id,
      },
      data: {
        countAttempt: 0,
        limitTime: null,
      },
    });

    delete user.password;
    return user;
  }

  async register(User: UserDto) {
    const checkUser = await this.prisma.user.findUnique({
      where: {
        email: User.email,
      },
    });
    if (checkUser) {
      throw new ThereIsAnErrorException('Email already registered');
    } else {
      const success = new Promise((resolve, reject) => {
        hash(User.password, SALT_PASSWORD, async (err, hash) => {
          User.password = hash;

          const user = await this.prisma.user.create({
            data: User,
          });
          if (!user) reject();
          resolve(user);
        });
      });
      return success;
    }
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) throw new NotFoundException('User not found');
    const dataReturn = {
      status: true,
      message: 'User found',
      data: user,
    };
    delete dataReturn.data.password;
    return dataReturn;
  }

  async cekAttempt(
    user: User & { loginAttempt: Login_Attempt },
  ): Promise<{ status: boolean; second?: number }> {
    let res = true;
    let second = 0;
    if (user.loginAttempt) {
      if (user.loginAttempt.limitTime) {
        const nowDateTime: number = new Date().getTime() / 1000;
        let sub = nowDateTime - user.loginAttempt.limitTime.getTime() / 1000;
        sub = Math.round(sub);
        if (sub < 0) {
          res = false;
          return {
            status: res,
            second: Math.abs(sub),
          };
        }
      }
      if (user.loginAttempt.countAttempt >= 3) {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 3);
        await this.prisma.login_Attempt
          .update({
            where: {
              userId: user.id,
            },
            data: {
              countAttempt: 0,
              limitTime: date,
            },
          })
          .then(() => {
            res = false;
            second = 180;
          });
      } else {
        await this.prisma.login_Attempt.update({
          where: {
            userId: user.id,
          },
          data: {
            countAttempt: ++user.loginAttempt.countAttempt,
          },
        });
      }
    } else {
      await this.prisma.login_Attempt.create({
        data: {
          userId: user.id,
          countAttempt: 1,
        },
      });
    }

    return {
      status: res,
      second,
    };
  }
}
