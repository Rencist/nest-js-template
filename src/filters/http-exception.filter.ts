import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { isObject } from 'class-validator';
import { Response } from 'express';
import { createWriteStream } from 'fs';
import * as fs from 'fs';
@Catch(HttpException)
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let msg = exception.getResponse();

    if (status == 500) {
      const checkFolderLog = fs.existsSync('src/log/error.log');
      if (!checkFolderLog) {
        fs.mkdirSync('src/log');
      }
      const stream = createWriteStream('src/log/error.log', { flags: 'a' });
      const buf = Buffer.from(msg.toString(), 'utf8');
      const time = Buffer.from(new Date().toISOString(), 'utf8');
      stream.write('\n[');
      stream.write(time);
      stream.write(']\n');
      stream.write(buf);
      stream.write('\n');
      stream.end();
      msg = 'Internal server error';
    }

    if (isObject(msg)) {
      response.status(status).json({
        status: false,
        message: msg['message'],
      });
    } else {
      response.status(status).json({
        status: false,
        message: msg,
      });
    }
  }
}
