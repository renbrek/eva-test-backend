import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { Channels } from '@prisma/client';
import { CampaignIdDto } from 'src/campaigns/dto';
import { CampaignOwner } from 'src/common/guards/campaign-owner.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto';

@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}
 
  @UseGuards(CampaignOwner)
  @Post('getAllByCampaignId')
  getAllChannelsByCampaignId(@Body() dto: CampaignIdDto): Promise<Channels[]> {
    return this.channelsService.getAllChannelsByCampaignId(dto);
  }

  @UseGuards(CampaignOwner)
  @Put('updateById')
  updateChannelById() {

  }
}
