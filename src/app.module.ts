import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://influencersACyber:Musabe123@cluster0.kpfza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserModule,
  ],
})
export class AppModule {}
