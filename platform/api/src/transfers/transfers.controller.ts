import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@ApiTags('Transfers (PayPal Send Money)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private service: TransfersService) {}

  @Post()
  @ApiHeader({ name: 'Idempotency-Key', required: false })
  create(
    @CurrentUser() user: { customerId: string },
    @Body() dto: CreateTransferDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.service.create(
      user.customerId,
      dto.amount,
      dto.destination,
      dto.description,
      idempotencyKey,
    );
  }

  @Get()
  list(@CurrentUser() user: { customerId: string }) {
    return this.service.list(user.customerId);
  }
}
