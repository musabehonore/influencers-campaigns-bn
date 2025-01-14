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
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
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
  @ApiBearerAuth()
  async getJoinedCampaigns(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new HttpException(
        'Authorization is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as {
      influencerId: string;
      role: string;
    };
    const role = decoded.role;
    if (role !== 'influencer') {
      throw new HttpException(
        'Only influencers can see their campaigns joined',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.campaignService.getJoinedCampaigns(decoded.influencerId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Influencer join a campaign' })
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  async reviewPost(
    @Headers('authorization') authHeader: string,
    @Param('campaignId') campaignId: string,
    @Query('name') name: string,
    @Query('postId') postId: string,
    @Query('status') status: 'accepted' | 'rejected',
  ) {
    if (!authHeader) {
      throw new HttpException(
        'Authorization is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as { role: string };
    if (decoded.role !== 'manager') {
      throw new HttpException(
        'Unauthorized, the service is for managers only',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.campaignService.reviewPost(
      campaignId,
      name,
      postId,
      status,
    );
  }
  @Get(':id')
  @ApiOperation({ summary: 'Fetch single campaign' })
  async getSingleCampain(@Param('id') campaignId: string) {
    return await this.campaignService.getSingleCampaign(campaignId);
  }
}
