import { IsEmail, IsUUID } from 'class-validator';

export class ActivationMailDto {
  @IsUUID()
  readonly link: string;
  @IsEmail()
  readonly to: string;
}
