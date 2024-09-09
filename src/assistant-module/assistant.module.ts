import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { OpenAIModule } from '../openai/openai.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [OpenAIModule, UserModule],
  providers: [AssistantService],
  controllers: [AssistantController],
  exports: [AssistantService],
})
export class AssistantModule {}
