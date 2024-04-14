import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
export class PaginationParams {
  @Type(() => Number)
  @ApiProperty({ example: '10', description: 'limit' })
  @IsNumber()
  readonly limit: number;
  @Type(() => Number)
  @ApiProperty({ example: '5', description: 'page' })
  @IsNumber()
  readonly page: number;
}
