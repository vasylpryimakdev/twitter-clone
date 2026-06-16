import { IsIn } from "class-validator";
import { ReactionType, ReactionTypes } from "../types/reaction.entity";

export class ReactionDto {
  @IsIn([ReactionTypes.LIKE, ReactionTypes.DISLIKE]) type!: ReactionType;
}
