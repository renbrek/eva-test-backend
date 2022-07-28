import { IsNotEmpty } from '@nestjs/class-validator';

export class CampaignCreateDto {
  @IsNotEmpty()
  name: string;
}

export class CampaignIdDto {
  @IsNotEmpty()
  campaignId: string;
}

export class CampaignUpdateDto {
  @IsNotEmpty()
  campaignId: string;
  @IsNotEmpty()
  name: string;
}
