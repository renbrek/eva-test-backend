import { Injectable, NotFoundException } from '@nestjs/common';
import { Buttons } from '@prisma/client';
import { CampaignIdDto } from 'src/campaigns/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelUpdateDto, DeleteButtonDto } from './dto';
import { ChannelInfo } from './types';
@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async getAllChannelsByCampaignId(dto: CampaignIdDto): Promise<ChannelInfo[]> {
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

    let channelsResponse: ChannelInfo[] = [];

    await Promise.all(
      channels.map(async (channel) => {
        const keyboard = await this.prisma.keyboard.findUnique({
          where: {
            channelId: channel.id,
          },
        });

        const buttons = await this.prisma.buttons.findMany({
          where: {
            keyboardId: keyboard.id,
          },
        });

        const sortButtons = (a: Buttons, b: Buttons) => {
          let lna = a.text;
          let lnb = b.text;

          if (lna < lnb) return -1;
          if (lna > lnb) return 1;
          return 0;
        };

        buttons.sort(sortButtons);

        channelsResponse.push({
          id: channel.id,
          createdAt: channel.createdAt,
          updatedAt: channel.updatedAt,
          type: channel.type,
          text: channel.text,
          isActive: channel.isActive,
          campaignId: channel.campaignId,
          isInlineKeyboard: keyboard.isInline,
          buttons: buttons,
        });
      }),
    );

    const sortChannels = (a: ChannelInfo, b: ChannelInfo) => {
      let lna = a.type;
      let lnb = b.type;

      if (lna < lnb) return 1;
      if (lna > lnb) return -1;
      return 0;
    };

    channelsResponse.sort(sortChannels);

    return channelsResponse;
  }

  async updateChannelById(dto: ChannelUpdateDto): Promise<void> {
    const channel = await this.prisma.channels.findUnique({
      where: {
        id: dto.channelId,
      },
    });

    if (!channel)
      throw new NotFoundException('Channel with this id does not exist');

    await this.prisma.channels.update({
      where: {
        id: channel.id,
      },
      data: {
        isActive: dto.isActive,
        text: dto.text,
        keyboard: {
          update: {
            isInline: dto.isInlineKeyboard,
          },
        },
      },
    });

    await Promise.all(
      dto.buttons.map(async (button) => {
        const keyboard = await this.prisma.keyboard.findUnique({
          where: {
            channelId: channel.id,
          },
        });

        if (!button.id) {
          console.log('create ');

          await this.prisma.buttons.create({
            data: {
              text: button.text,
              isInlineButton: button.isInlineButton,
              isLinkButton: button.isLinkButton,
              link: button.link,
              keyboardId: keyboard.id,
            },
          });
        }

        if (button.id) {
          console.log(`upsert`);

          await this.prisma.buttons.upsert({
            where: {
              id: button.id,
            },
            update: {
              text: button.text,
              isInlineButton: button.isInlineButton,
              isLinkButton: button.isLinkButton,
              link: button.link,
            },
            create: {
              text: button.text,
              isInlineButton: button.isInlineButton,
              isLinkButton: button.isLinkButton,
              link: button.link,
              keyboardId: keyboard.id,
            },
          });
        }
      }),
    );
  }

  async deleteButtonById(dto: DeleteButtonDto) {
    const button = await this.prisma.buttons.findUnique({
      where: {
        id: dto.buttonId,
      },
    });

    if (!button) throw new NotFoundException('Button does not exists');

    await this.prisma.buttons.delete({
      where: {
        id: dto.buttonId,
      },
    });
  }
}
