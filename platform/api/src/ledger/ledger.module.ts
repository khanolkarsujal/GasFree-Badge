import { Global, Module } from '@nestjs/common';
import { FormanceService } from './formance.service';

@Global()
@Module({
  providers: [FormanceService],
  exports: [FormanceService],
})
export class LedgerModule {}
