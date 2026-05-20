import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { NonceDto, VerifySiweDto } from './dto/auth.dto';

@ApiTags('Auth (SIWE)')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('nonce')
  @ApiOperation({ summary: 'Get SIWE nonce + message (EIP-4361)' })
  nonce(@Body() dto: NonceDto) {
    return this.auth.createNonce(dto.address);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify signature and issue JWT' })
  verify(@Body() dto: VerifySiweDto) {
    return this.auth.verifyLogin(dto.message, dto.signature);
  }
}
