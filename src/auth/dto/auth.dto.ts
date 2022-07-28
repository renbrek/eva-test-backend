import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
