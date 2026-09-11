import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@recipeapi.dev' })
  @IsEmail()
  email!: string;
}