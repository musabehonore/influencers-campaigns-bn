import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  // Create a new campaign
  async createCampaign(
    createCampaignDto: CreateCampaignDto,
  ): Promise<{ success: boolean; data?: Campaign; message: string }> {
    try {
      const newCampaign = new this.campaignModel(createCampaignDto);
      const savedCampaign = await newCampaign.save();
      return {
        success: true,
        data: savedCampaign,
        message: 'Campaign created successfully!',
      };
    } catch (error) {
      console.error('Error creating campaign:', error.message);
      return {
        success: false,
        message: error.message || 'An unknown error occurred.',
      };
    }
  }

  // Get all campaigns (accessible by influencers and others)
  async getAllCampaigns(): Promise<{
    success: boolean;
    data?: Campaign[];
    message: string;
  }> {
    try {
      const campaigns = await this.campaignModel.find().exec();
      return {
        success: true,
        data: campaigns,
        message: 'Campaigns fetched successfully!',
      };
    } catch (error) {
      console.error('Error fetching campaigns:', error.message);
      return {
        success: false,
        message: error.message || 'An unknown error occurred.',
      };
    }
  }

  // Get campaigns joined by an influencer
  async getJoinedCampaigns(
    influencerId: string,
  ): Promise<{ success: boolean; data?: Campaign[]; message: string }> {
    try {
      const campaigns = await this.campaignModel
        .find({ 'influencers.influencerId': influencerId })
        .exec();

      return {
        success: true,
        data: campaigns,
        message: 'Joined campaigns fetched successfully.',
      };
    } catch (error) {
      console.error('Error fetching joined campaigns:', error.message);
      return {
        success: false,
        message: error.message || 'An unknown error occurred.',
      };
    }
  }

  // Join a campaign (for influencers)
  async joinCampaign(
    campaignId: string,
    influencerId: string,
    name: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const campaign = await this.campaignModel.findById(campaignId);

      if (!campaign) {
        return { success: false, message: 'Campaign not found.' };
      }

      const alreadyJoined = campaign.influencers.some(
        (inf) => inf.influencerId === influencerId,
      );

      if (alreadyJoined) {
        return {
          success: false,
          message: 'You have already joined this campaign.',
        };
      }

      campaign.influencers.push({
        influencerId,
        name,
        joiningDate: new Date(),
        numberOfPosts: 0,
        posts: [],
      });

      await campaign.save();

      return { success: true, message: 'Successfully joined the campaign.' };
    } catch (error) {
      console.error('Error joining campaign:', error.message);
      return {
        success: false,
        message: error.message || 'An unknown error occurred.',
      };
    }
  }

  // Submit a post (link) to a campaign
  async submitPost(
    campaignId: string,
    influencerId: string,
    postLink: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const campaign = await this.campaignModel.findById(campaignId);

      if (!campaign) {
        return { success: false, message: 'Campaign not found.' };
      }

      const influencer = campaign.influencers.find(
        (inf) => inf.influencerId === influencerId,
      );

      if (!influencer) {
        return {
          success: false,
          message: 'You have not joined this campaign.',
        };
      }

      influencer.posts.push({ link: postLink, status: 'pending' });
      influencer.numberOfPosts += 1;

      await campaign.save();

      return { success: true, message: 'Post submitted successfully.' };
    } catch (error) {
      console.error('Error submitting post:', error.message);
      return {
        success: false,
        message: error.message || 'An unknown error occurred.',
      };
    }
  }

  // Get campaigns owned by a brand manager
  async getOwnCampaigns(
    name: string,
  ): Promise<{ success: boolean; data?: Campaign[]; message: string }> {
    try {
      console.log(name);
      if (typeof name !== 'string') {
        throw new Error('Invalid brand owner name');
      }
      const campaigns = await this.campaignModel
        .find({ brandOwner: name })
        .exec();

      return {
        success: true,
        data: campaigns,
        message: 'Own campaigns fetched successfully.',
      };
    } catch (error) {
      console.error('Error fetching own campaigns:', error.message);
      return {
        success: false,
        message: error.message || 'An unknown error occurred.',
      };
    }
  }

  // Accept or reject a post submitted by an influencer
  async reviewPost(
    campaignId: string,
    influencerId: string,
    postId: string,
    status: 'accepted' | 'rejected',
  ): Promise<{ success: boolean; message: string }> {
    try {
      const campaign = await this.campaignModel.findById(campaignId);

      if (!campaign) {
        return { success: false, message: 'Campaign not found.' };
      }

      const influencer = campaign.influencers.find(
        (inf) => inf.influencerId === influencerId,
      );

      if (!influencer) {
        return {
          success: false,
          message: 'Influencer not found in this campaign.',
        };
      }

      const post = influencer.posts.find((p) => p._id.toString() === postId);

      if (!post) {
        return { success: false, message: 'Post not found.' };
      }

      post.status = status;

      await campaign.save();

      return { success: true, message: `Post ${status} successfully.` };
    } catch (error) {
      console.error('Error reviewing post:', error.message);
      return {
        success: false,
        message: error.message || 'An unknown error occurred.',
      };
    }
  }
}
