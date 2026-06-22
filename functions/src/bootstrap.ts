import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { expressApp } from "./expressApp";

export async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  app.useGlobalPipes(
    new (require("@nestjs/common").ValidationPipe)({
      whitelist: true,
      transform: true,
    }),
  );

  await app.init();
}
