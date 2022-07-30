import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService, PrismaClient],
})
export class ChannelsModule {}
