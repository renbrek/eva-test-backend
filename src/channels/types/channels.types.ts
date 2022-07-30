export type ChannelInfo = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  text: string;
  isActive: boolean;
  campaignId: string;
  isInlineKeyboard: boolean;
  buttons: {
    keyboardId: string;
    text: string;
    isInlineButton: boolean;
    isLinkButton: boolean;
    link?: string;
  }[];
};
