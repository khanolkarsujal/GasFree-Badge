import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BadgesService } from './badges.service';

@ApiTags('Badges')
@Controller('badges')
export class BadgesController {
  constructor(private badges: BadgesService) {}

  @Get('catalog')
  catalog() {
    return this.badges.getCatalog();
  }

  @Post('claim/prepare')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  prepare(@CurrentUser() user: { address: string }, @Body() body: { badgeId: string }) {
    return this.badges.prepareClaim(user.address, body.badgeId);
  }

  @Post('claims/record')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  record(
    @CurrentUser() user: { customerId: string },
    @Body() body: { txHash: string; badgeId: string },
  ) {
    return this.badges.recordClaim(user.customerId, body.txHash, body.badgeId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  mine(@CurrentUser() user: { customerId: string }) {
    return this.badges.listClaims(user.customerId);
  }
}
