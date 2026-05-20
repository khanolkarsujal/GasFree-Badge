import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'gasfree-platform-api',
      version: '2.0.0',
      stack: {
        api: 'NestJS',
        ledger: 'Formance',
        auth: 'SIWE + JWT',
        database: 'PostgreSQL + Prisma',
        cache: 'Redis',
      },
    };
  }
}
