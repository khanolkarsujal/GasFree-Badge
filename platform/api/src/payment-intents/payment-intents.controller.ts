import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaymentIntentsService } from './payment-intents.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@ApiTags('Payment Intents (Stripe-compatible)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment_intents')
export class PaymentIntentsController {
  constructor(private service: PaymentIntentsService) {}

  @Post()
  @ApiHeader({ name: 'Idempotency-Key', required: false })
  create(
    @CurrentUser() user: { customerId: string },
    @Body() dto: CreatePaymentIntentDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.service.create(user.customerId, dto.amount, dto.description, idempotencyKey);
  }

  @Post(':id/confirm')
  confirm(
    @CurrentUser() user: { customerId: string },
    @Param('id') id: string,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.service.confirm(user.customerId, id, idempotencyKey);
  }

  @Get()
  list(@CurrentUser() user: { customerId: string }) {
    return this.service.list(user.customerId);
  }

  @Get(':id')
  get(@CurrentUser() user: { customerId: string }, @Param('id') id: string) {
    return this.service.get(user.customerId, id);
  }
}
