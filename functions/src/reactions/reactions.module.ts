import { Module } from "@nestjs/common";
import { ReactionsService } from "./reactions.service";
import { ReactionsController } from "./reactions.controller";
import { ReactionsRepository } from "./reactions.repository";

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService, ReactionsRepository],
})
export class ReactionsModule {}
