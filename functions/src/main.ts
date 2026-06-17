import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";

export async function createNestServer() {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: ["http://localhost:5173"],
    credentials: true,
  });

  await app.init();

  return expressApp;
}
