import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PayoutsService } from './payouts.service';

@ApiTags('Payouts (Withdraw)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payouts')
export class PayoutsController {
  constructor(private service: PayoutsService) {}

  @Post()
  create(
    @CurrentUser() user: { customerId: string },
    @Body() body: { amount: string; destination?: string },
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.service.create(user.customerId, body.amount, body.destination, idempotencyKey);
  }

  @Get()
  list(@CurrentUser() user: { customerId: string }) {
    return this.service.list(user.customerId);
  }
}
