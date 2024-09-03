import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlatformDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsNotEmpty()
  @IsString()
  platformUserId: string;
}

export class UpdatePlatformDto {
  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  platformUserId?: string;
}
