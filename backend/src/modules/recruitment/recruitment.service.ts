import { Injectable } from '@nestjs/common';

@Injectable()
export class RecruitmentService {
  getStatus() {
    return {
      module: 'recruitment',
      status: 'coming soon',
      message: 'The recruitment module is under development.',
    };
  }
}
