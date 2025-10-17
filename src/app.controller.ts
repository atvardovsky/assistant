import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Root controller handling basic HTTP requests
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET endpoint returning a welcome message
   * @returns Welcome message string
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
