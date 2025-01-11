import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    JwtModule.register({
      secret: 'your-jwt-secret', // Replace with your actual secret
      signOptions: { expiresIn: '1d' }, // Replace with your actual options
    }),
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
