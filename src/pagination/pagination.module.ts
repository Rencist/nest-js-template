import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaginationService } from './pagination.service';

@Module({
  providers: [PaginationService],
  exports: [PaginationService],
  imports: [PrismaModule],
})
export class PaginationModule {}
