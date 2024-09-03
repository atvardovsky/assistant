import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  projectName: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  projectName?: string;
}
