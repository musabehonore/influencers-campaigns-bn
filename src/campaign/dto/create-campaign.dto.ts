import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  brandOwner: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsDate()
  deadline: Date;
}
