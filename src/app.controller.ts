import { Controller, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { ExceptionHandler } from './filters/http-exception.filter';

@Controller()
@UseFilters(new ExceptionHandler())
export class AppController {
  constructor(private readonly appService: AppService) {}
}
