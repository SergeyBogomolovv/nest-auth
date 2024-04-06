import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class PaginationParams {
  @ApiProperty({ example: '10', description: 'limit' })
  @IsNumberString()
  readonly limit: number;
  @ApiProperty({ example: '5', description: 'page' })
  @IsNumberString()
  readonly page: number;
}
