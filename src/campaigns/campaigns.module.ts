import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [CampaignsService, PrismaClient],
  controllers: [CampaignsController],
})
export class CampaignsModule {}
