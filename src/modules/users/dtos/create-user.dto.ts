import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

// decorator
import { IsRequired } from '../../../shared/decorators/is-required.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsRequired()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsRequired()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @IsRequired()
  password: string;
  @IsNumber()
  @IsNotEmpty()
  @IsRequired()
  role: number;
}
