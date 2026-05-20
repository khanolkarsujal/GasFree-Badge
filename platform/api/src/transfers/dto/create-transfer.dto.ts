import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const ETH_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export class CreateTransferDto {
  @ApiProperty({ example: '5.00' })
  @IsString()
  @Matches(/^\d+(\.\d+)?$/)
  amount: string;

  @ApiProperty()
  @Matches(ETH_ADDRESS)
  destination: string;

  @IsOptional()
  @IsString()
  description?: string;
}
