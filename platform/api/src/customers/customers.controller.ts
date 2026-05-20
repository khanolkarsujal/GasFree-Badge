import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CustomersService } from './customers.service';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private customers: CustomersService) {}

  @Get('me')
  getMe(@CurrentUser() user: { customerId: string }) {
    return this.customers.getMe(user.customerId);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: { customerId: string },
    @Body() body: { email?: string; name?: string; metadata?: object },
  ) {
    return this.customers.updateMe(user.customerId, body);
  }
}
