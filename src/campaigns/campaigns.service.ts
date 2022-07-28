import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Campaigns } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignIdDto, CampaignUpdateDto, CampaignCreateDto } from './dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async createCampaign(
    dto: CampaignCreateDto,
    userId: string,
  ): Promise<Campaigns> {
    const campaign = await this.prisma.campaigns.findFirst({
      where: {
        name: dto.name,
        userId,
      },
    });

    console.log(`campaign ${campaign}`);

    if (campaign)
      throw new ConflictException(
        'You have already created a campaign with this name',
      );

    const newCampaign = await this.prisma.campaigns.create({
      data: {
        name: dto.name,
        userId,
      },
    });

    return newCampaign;
  }

  async getAllCampaigns(userId: string): Promise<Campaigns[]> {
    const campaigns = await this.prisma.campaigns.findMany({
      where: {
        userId,
      },
    });

    return campaigns;
  }

  async getCampaignById(dto: CampaignIdDto): Promise<Campaigns> {
    const campaign = await this.prisma.campaigns.findUnique({
      where: {
        id: dto.campaignId,
      },
    });

    if (!campaign) throw new NotFoundException('Campaign does not exists');

    return campaign;
  }

  async updateCampaignById(dto: CampaignUpdateDto): Promise<Campaigns> {
    const campaign = await this.prisma.campaigns.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (campaign)
      throw new ConflictException(
        'You have already created a campaign with this name',
      );

    const updatedCampaign = await this.prisma.campaigns.update({
      where: {
        id: dto.campaignId,
      },
      data: {
        name: dto.name,
      },
    });

    return updatedCampaign;
  }

  async deleteCampaignById(dto: CampaignIdDto) {
    const campaign = await this.prisma.campaigns.findUnique({
      where: {
        id: dto.campaignId,
      },
    });

    if (!campaign) throw new NotFoundException('Campaign does not exists');

    await this.prisma.campaigns.delete({
      where: {
        id: dto.campaignId,
      },
    });
  }
}
