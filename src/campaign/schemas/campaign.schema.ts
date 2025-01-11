import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema()
export class Campaign {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  brandOwner: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  deadline: Date;

  @Prop({
    type: [
      {
        influencerId: String,
        name: String,
        joiningDate: Date,
        numberOfPosts: Number,
        posts: [
          {
            link: String,
            status: { type: String, default: 'pending' }, // pending, accepted, rejected
          },
        ],
      },
    ],
    default: [],
  })
  influencers: Array<{
    influencerId: string;
    name: string;
    joiningDate: Date;
    numberOfPosts: number;
    posts: Array<{ link: string; status: string; _id?: object }>;
  }>;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
