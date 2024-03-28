import { ApiProperty } from '@nestjs/swagger';

export class OAuthDto {
  @ApiProperty({ example: 'gerax', description: 'username' })
  readonly name: string;
  @ApiProperty({ example: 'email@gmail.com', description: 'email' })
  readonly email: string;
  @ApiProperty({ example: 'linkto/image/sdf.cpm', description: 'image' })
  readonly image?: string;
}
