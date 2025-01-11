import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('campaigns')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return await this.campaignService.createCampaign(createCampaignDto);
  }

  @Get()
  async getAllCampaigns() {
    return await this.campaignService.getAllCampaigns();
  }

  @Get('joined')
  async getJoinedCampaigns(@Headers('authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as { influencerId: string };
    return await this.campaignService.getJoinedCampaigns(decoded.influencerId);
  }

  @Post(':id/join')
  async joinCampaign(
    @Param('id') campaignId: string,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as {
      influencerId: string;
      name: string;
    };
    return await this.campaignService.joinCampaign(
      campaignId,
      decoded.influencerId,
      decoded.name,
    );
  }

  @Post(':id/post')
  async submitPost(
    @Param('id') campaignId: string,
    @Body('link') postLink: string,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as { influencerId: string };
    return await this.campaignService.submitPost(
      campaignId,
      decoded.influencerId,
      postLink,
    );
  }

  @Get('owned')
  async getOwnCampaigns(@Headers('authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as { brandOwnerId: string };
    return await this.campaignService.getOwnCampaigns(decoded.brandOwnerId);
  }

  @Put(':id/review')
  async reviewPost(
    @Param('id') campaignId: string,
    @Query('influencerId') influencerId: string,
    @Query('postId') postId: string,
    @Query('status') status: 'accepted' | 'rejected',
  ) {
    return await this.campaignService.reviewPost(
      campaignId,
      influencerId,
      postId,
      status,
    );
  }
}
