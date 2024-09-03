import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBotConfigurationDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  assistantId: string;

  @IsNotEmpty()
  @IsString()
  settings: string;
}

export class UpdateBotConfigurationDto extends PartialType(CreateBotConfigurationDto) {}