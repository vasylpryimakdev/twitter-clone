import { IsEnum } from "class-validator";
import { ReactionType } from "../types/reaction.entity";

export class ReactionDto {
  @IsEnum(ReactionType)
  type!: ReactionType;
}
