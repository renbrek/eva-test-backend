import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Channels } from '@prisma/client';
import { CampaignIdDto } from 'src/campaigns/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async getAllChannelsByCampaignId(dto: CampaignIdDto): Promise<Channels[]> {
    const campaign = await this.prisma.campaigns.findUnique({
      where: {
        id: dto.campaignId,
      },
    });

    if (!campaign)
      throw new NotFoundException('Company with this id does not exist');

    const channels = await this.prisma.channels.findMany({
      where: {
        campaignId: dto.campaignId,
      },
    });

    return channels;
  }

  async updateChannelById() {}
}
