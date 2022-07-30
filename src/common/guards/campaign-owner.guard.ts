import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class CampaignOwner implements CanActivate {
  constructor(private prisma: PrismaClient) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.isOwner(request);
  }

  async isOwner(request: any): Promise<boolean> {
    return this.checkByCampaignId(request) || this.checkByChannelId(request);
  }

  async checkByChannelId(request: any): Promise<boolean> {
    const userId = request.user.sub;

    const channelId = request.body.channelId;

    const campaign = await this.prisma.campaigns.findFirst({
      where: {
        ownerId: userId,
        channels: {
          some: {
            id: channelId,
          },
        },
      },
    });

    if (!campaign) return false;

    return true;
  }

  async checkByCampaignId(request: any): Promise<boolean> {
    const userId = request.user.sub;

    const campaignId = request.body.campaignId;

    const campaign = await this.prisma.campaigns.findFirst({
      where: {
        id: campaignId,
        ownerId: userId,
      },
    });

    if (!campaign) return false;

    return true;
  }
}
