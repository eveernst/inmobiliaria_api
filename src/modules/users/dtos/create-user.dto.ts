import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';

// decorator
import { IsRequired } from '../../../shared/decorators/is-required.decorator';
import { UserRole } from '../../../shared/enums/user-role.enum';

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
  @IsEnum(UserRole)
  @IsNotEmpty()
  @IsRequired()
  role: UserRole;
}
