import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TopupDto {
  @ApiProperty({ example: '100.00', description: 'Amount in TYI' })
  @IsString()
  @Matches(/^\d+(\.\d+)?$/)
  amount: string;
}
