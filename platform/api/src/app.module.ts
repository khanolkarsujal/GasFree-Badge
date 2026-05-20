import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { LedgerModule } from './ledger/ledger.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { PaymentIntentsModule } from './payment-intents/payment-intents.module';
import { TransfersModule } from './transfers/transfers.module';
import { BalanceModule } from './balance/balance.module';
import { PayoutsModule } from './payouts/payouts.module';
import { HealthModule } from './health/health.module';
import { ChainModule } from './chain/chain.module';
import { WalletModule } from './wallet/wallet.module';
import { BadgesModule } from './badges/badges.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    RedisModule,
    LedgerModule,
    ChainModule,
    AuthModule,
    CustomersModule,
    WalletModule,
    PaymentIntentsModule,
    TransfersModule,
    BalanceModule,
    PayoutsModule,
    BadgesModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
