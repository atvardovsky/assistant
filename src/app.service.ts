import { Injectable } from '@nestjs/common';

/**
 * Root application service providing basic functionality
 */
@Injectable()
export class AppService {
  /**
   * Returns a simple greeting message
   * @returns Hello World message
   */
  getHello(): string {
    return 'Hello World!';
  }
}
