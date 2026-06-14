import { Injectable } from "@nestjs/common";
import { ReactionsRepository } from "./reactions.repository";
import { ReactionType } from "./types/reaction.entity";

@Injectable()
export class ReactionsService {
  constructor(private readonly repo: ReactionsRepository) {}

  async react(
    postId: string,
    userId: string,
    type: ReactionType,
  ): Promise<void> {
    const id = `${postId}_${userId}`;

    const existing = await this.repo.findById(id);

    if (!existing) {
      await this.repo.create({
        id,
        postId,
        userId,
        type,
      });
      return;
    }

    if (existing.type === type) {
      await this.repo.delete(id);
      return;
    }

    await this.repo.update(id, {
      type,
    });
  }
}
