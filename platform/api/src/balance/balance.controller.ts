import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BalanceService } from './balance.service';
import { TopupDto } from './dto/topup.dto';

@ApiTags('Balance (PayPal Wallet)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('balance')
export class BalanceController {
  constructor(private service: BalanceService) {}

  @Get()
  get(@CurrentUser() user: { customerId: string }) {
    return this.service.getBalance(user.customerId);
  }

  @Post('topup')
  @ApiHeader({ name: 'Idempotency-Key', required: false })
  @ApiHeader({ name: 'X-Topup-Secret', required: false })
  topup(
    @CurrentUser() user: { customerId: string },
    @Body() dto: TopupDto,
    @Headers('idempotency-key') idempotencyKey?: string,
    @Headers('x-topup-secret') topupSecret?: string,
  ) {
    return this.service.topup(user.customerId, dto.amount, idempotencyKey, topupSecret);
  }

  @Get('transactions')
  transactions(@CurrentUser() user: { customerId: string }) {
    return this.service.listTransactions(user.customerId);
  }
}
