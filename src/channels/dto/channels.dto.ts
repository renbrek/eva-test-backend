export class CreateChannelDto {
  campaignId: string;
  type: string;
  text: string;
}

export class UpdateChannelDto {
  text: string;
  isInlineKeyboard: boolean;
  buttons: [];
}
