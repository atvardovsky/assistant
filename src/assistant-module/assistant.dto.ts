// assistant.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly message: string;
}

export class SendFileDto {
  @IsNotEmpty()
  @IsString()
  readonly message: string;
}
