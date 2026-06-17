import { IsIn } from "class-validator";
import { ReactionType, ReactionTypes } from "../reaction.entity";

export class ReactionDto {
  @IsIn([ReactionTypes.LIKE, ReactionTypes.DISLIKE]) type!: ReactionType;
}
