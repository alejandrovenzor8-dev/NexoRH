import { Injectable } from '@nestjs/common';

@Injectable()
export class AutomationService {
  getStatus() {
    return {
      module: 'automation',
      status: 'coming soon',
      message: 'The automation module is under development.',
    };
  }
}
