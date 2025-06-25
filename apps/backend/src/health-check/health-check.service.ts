import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckService {
  check() {
    return { status: 'ok' };
  }
}
