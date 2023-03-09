import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  pageSize: number = undefined;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  pageIndex = 1;

  @IsOptional()
  @ApiPropertyOptional()
  sort: string = undefined;

  @IsOptional()
  @ApiPropertyOptional()
  type: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @ApiPropertyOptional()
  globalFilter: string = undefined;
}
