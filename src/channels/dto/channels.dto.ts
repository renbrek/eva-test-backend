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
    id?: string;
    text: string;
    isInlineButton: boolean;
    isLinkButton: boolean;
    link?: string;
  }[];
}

export class DeleteButtonDto {
  buttonId: string;
}
