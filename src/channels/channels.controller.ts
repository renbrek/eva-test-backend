import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CampaignIdDto } from 'src/campaigns/dto';
import { CampaignOwner } from 'src/common/guards/campaign-owner.guard';
import { ChannelsService } from './channels.service';
import { ChannelUpdateDto, DeleteButtonDto } from './dto';
import { ChannelInfo } from './types';

@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @UseGuards(CampaignOwner)
  @Post('getAllByCampaignId')
  @HttpCode(HttpStatus.OK)
  getAllChannelsByCampaignId(
    @Body() dto: CampaignIdDto,
  ): Promise<ChannelInfo[]> {
    return this.channelsService.getAllChannelsByCampaignId(dto);
  }

  @UseGuards(CampaignOwner)
  @Put('updateById')
  @HttpCode(HttpStatus.OK)
  updateChannelById(@Body() dto: ChannelUpdateDto) {
    return this.channelsService.updateChannelById(dto);
  }

  @Delete('deleteButtonById')
  deleteButtonById(@Body() dto: DeleteButtonDto) {
    return this.channelsService.deleteButtonById(dto);
  }
}
