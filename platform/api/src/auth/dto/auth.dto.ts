import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const ETH_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export class NonceDto {
  @ApiProperty({ example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' })
  @Matches(ETH_ADDRESS, { message: 'Invalid Ethereum address' })
  address: string;
}

export class VerifySiweDto {
  @IsString()
  @MinLength(10)
  message: string;

  @IsString()
  @MinLength(10)
  signature: string;
}
