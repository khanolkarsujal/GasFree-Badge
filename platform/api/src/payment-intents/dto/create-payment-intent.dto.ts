import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: '10.50' })
  @IsString()
  @Matches(/^\d+(\.\d+)?$/)
  amount: string;

  @IsOptional()
  @IsString()
  description?: string;
}
