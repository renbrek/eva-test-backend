export class ChannelCreateDto {
  campaignId: string;
  type: string;
  text: string;
}

export class ChannelUpdateDto {
  channelId: string;
  isActive: boolean;
  text: string;
  isInlineKeyboard: boolean;
  buttons: {
    buttonId?: string;
    text: string;
    isInlineButton: boolean;
    isLinkButton: boolean;
    link?: string;
  }[];
}
