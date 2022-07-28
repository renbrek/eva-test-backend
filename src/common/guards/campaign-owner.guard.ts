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
    const userId = request.user.sub;

    const campaignId = request.body.campaignId;

    if (!campaignId) throw new BadRequestException("Campaign ID can't be null");

    const campaign = await this.prisma.campaigns.findFirst({
      where: {
        id: campaignId,
        userId,
      },
    });

    if (!campaign) return false;

    return true;
  }
}
