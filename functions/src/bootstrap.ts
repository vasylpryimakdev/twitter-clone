import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import express from "express";
import helmet from "helmet";

let cachedApp: any;

export async function bootstrap() {
  if (cachedApp) return cachedApp;

  const expressInstance = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  const corsOrigin = process.env.CORS_ORIGIN?.split(",") ?? [];

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.init();

  cachedApp = expressInstance;

  return cachedApp;
}
