import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
  });
  // app.use(cors());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Influencer Campaign API')
    .setDescription('API documentation for managing campaigns and influencers.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
