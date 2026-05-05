import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagingService {
  getStatus() {
    return {
      module: 'messaging',
      status: 'coming soon',
      message: 'The messaging module is under development.',
    };
  }
}
