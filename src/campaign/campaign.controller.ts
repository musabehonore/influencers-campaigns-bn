import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
// import { CreateCampaignDto } from './dto/create-campaign.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Controller('campaigns')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a campaign' })
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return await this.campaignService.createCampaign(createCampaignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all campaigns' })
  async getAllCampaigns() {
    return await this.campaignService.getAllCampaigns();
  }

  @Get('joined')
  @ApiOperation({ summary: 'Fetch campaigns an influencer has joined' })
  async getJoinedCampaigns(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new HttpException(
        'Authorization is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as { influencerId: string };
    return await this.campaignService.getJoinedCampaigns(decoded.influencerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch single campaign' })
  async getSingleCampain(@Param('id') campaignId: string) {
    return await this.campaignService.getSingleCampaign(campaignId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Influencer join a campaign' })
  async joinCampaign(
    @Param('id') campaignId: string,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new HttpException(
        'Authorization is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
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
  @ApiOperation({ summary: 'Influencer submit a post' })
  @ApiBody({})
  async submitPost(
    @Param('id') campaignId: string,
    @Body('link') postLink: string,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new HttpException(
        'Authorization is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as { influencerId: string };
    return await this.campaignService.submitPost(
      campaignId,
      decoded.influencerId,
      postLink,
    );
  }

  @Get('owned')
  @ApiOperation({ summary: 'Manager gets his/her own campaigns' })
  async getOwnCampaigns(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new HttpException(
        'Authorization is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as { name: string };
    // console.log('Decoded here2: ', decoded);
    return await this.campaignService.getOwnCampaigns(decoded.name);
  }

  @Put(':id/review')
  @ApiOperation({ summary: 'Manager approves and rejects a post' })
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
