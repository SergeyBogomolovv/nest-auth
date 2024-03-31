import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponse {
  @ApiProperty({
    example: 'Confirmation email sent!',
    description: 'message',
  })
  message: string;
}
