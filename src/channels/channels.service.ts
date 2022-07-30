import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignIdDto } from 'src/campaigns/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelUpdateDto } from './dto';
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

    return channelsResponse;
  }

  async updateChannelById(dto: ChannelUpdateDto) {
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

    // await this.prisma.buttons.upsert({
    //   where: {
    //     id: 'asdfasdf',
    //   },
    //   update: {
    //     text: 'button.text updated some',
    //     isInlineButton: false,
    //     isLinkButton: false,
    //     link: undefined,
    //   },
    //   create: {
    //     text: 'button.text',
    //     isInlineButton: false,
    //     isLinkButton: false,
    //     link: undefined,
    //     keyboardId: '0a746dd5-b71a-4326-b675-d2c850189641',
    //   },
    // });

    await Promise.all(
      dto.buttons.map(async (button) => {
        const keyboard = await this.prisma.keyboard.findUnique({
          where: {
            channelId: channel.id,
          },
        });

        if (!button.buttonId) {
          console.log('create');

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

        if (button.buttonId) {
          console.log(`upsert`);

          await this.prisma.buttons.upsert({
            where: {
              id: button.buttonId,
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

    const updatedChannel = await this.prisma.channels.findUnique({
      where: {
        id: dto.channelId,
      },
    });

    return updatedChannel;
  }
}
