import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './resources/auth/auth.module';
import { JwtModule } from './guards/jwt/jwt.module';
import { PaginationModule } from './pagination/pagination.module';
import { EmailModule } from './resources/email/email.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { resolve } from 'path';

const ENV = process.env.ENV;

@Module({
  imports: [
    ServeStaticModule.forRoot(
      (() => {
        const publicDir = resolve('src/uploads');
        const servePath = '/files';

        return {
          rootPath: publicDir,

          serveRoot: servePath,
          exclude: ['/api*'],
        };
      })(),
    ),
    ServeStaticModule.forRoot({
      rootPath: resolve('src/resources/sertifikat-peserta/asset-sertifikat'),
      serveRoot: '/public/',
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    PrismaModule,
    AuthModule,
    JwtModule,
    PaginationModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
