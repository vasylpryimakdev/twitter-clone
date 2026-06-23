import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from "@nestjs/common";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { PostsModule } from "./posts/posts.module";
import { CommentsModule } from "./comments/comments.module";
import { FirebaseModule } from "./common/firebase/firebase.module";
import { FirebaseAuthGuard } from "./common/firebase/auth/firebase-auth.guard";
import { ContentTypeMiddleware } from "./common/middlewares/content-type.middleware";
import { validateEnv } from "./common/config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => [
        {
          ttl: Number(configService.get("THROTTLE_TTL") ?? 60),
          limit: Number(configService.get("THROTTLE_LIMIT") ?? 100),
        },
      ],
    }),
    FirebaseModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        stopAtFirstError: true,
      }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContentTypeMiddleware).forRoutes("*");
  }
}
