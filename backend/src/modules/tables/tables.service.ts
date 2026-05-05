import { Injectable } from '@nestjs/common';

@Injectable()
export class TablesService {
  getStatus() {
    return {
      module: 'dynamic-tables',
      status: 'coming soon',
      message: 'The dynamic tables module is under development.',
    };
  }
}
