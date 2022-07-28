import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Campaigns } from '@prisma/client';
import { GetCurrentUserId } from 'src/common/decorators';
import { CampaignOwner } from 'src/common/guards/campaign-owner.guard';
import { CampaignsService } from './campaigns.service';
import { CampaignIdDto, CampaignUpdateDto, CampaignCreateDto } from './dto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createCampaign(
    @Body() dto: CampaignCreateDto,
    @GetCurrentUserId() userId: string,
  ): Promise<Campaigns> {
    return this.campaignsService.createCampaign(dto, userId);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAllCampaigns(@GetCurrentUserId() userId: string): Promise<Campaigns[]> {
    return this.campaignsService.getAllCampaigns(userId);
  }

  @UseGuards(CampaignOwner)
  @Post('getById')
  @HttpCode(HttpStatus.OK)
  getCampaignById(@Body() dto: CampaignIdDto): Promise<Campaigns> {
    return this.campaignsService.getCampaignById(dto);
  }

  @UseGuards(CampaignOwner)
  @Put('updateById')
  @HttpCode(HttpStatus.OK)
  updateCampaignById(@Body() dto: CampaignUpdateDto): Promise<Campaigns> {
    return this.campaignsService.updateCampaignById(dto);
  }

  @UseGuards(CampaignOwner)
  @Delete('deleteById')
  @HttpCode(HttpStatus.OK)
  deleteCampaignById(@Body() dto: CampaignIdDto) {
    return this.campaignsService.deleteCampaignById(dto);
  }
}
