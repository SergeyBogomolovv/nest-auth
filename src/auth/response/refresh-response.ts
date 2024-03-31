import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponse {
  @ApiProperty({
    example: 'dsjknfsDjkfjdsfgjdsfvnJNDFjnsdjfdsjfsdjfn',
    description: 'accesToken',
  })
  accesToken: string;
}
