import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  @IsNumber()
  projectId?: number;
}
