import { Injectable } from "@nestjs/common";
import { ReactionsRepository } from "./reactions.repository";

export type ReactionType = "like" | "dislike";

@Injectable()
export class ReactionsService {
  constructor(private readonly repo: ReactionsRepository) {}

  async like(postId: string, userId: string): Promise<void> {
    const existing = await this.repo.findByPostAndUser(postId, userId);

    if (!existing) {
      await this.repo.create({
        id: this.buildId(postId, userId),
        postId,
        userId,
        type: "like",
      });
      return;
    }

    if (existing.type === "like") return;

    await this.repo.updateType(existing.id, "like");
  }

  async dislike(postId: string, userId: string): Promise<void> {
    const existing = await this.repo.findByPostAndUser(postId, userId);

    if (!existing) {
      await this.repo.create({
        id: this.buildId(postId, userId),
        postId,
        userId,
        type: "dislike",
      });
      return;
    }

    if (existing.type === "dislike") return;

    await this.repo.updateType(existing.id, "dislike");
  }

  async remove(postId: string, userId: string): Promise<void> {
    const existing = await this.repo.findByPostAndUser(postId, userId);

    if (!existing) return;

    await this.repo.delete(existing.id);
  }

  private buildId(postId: string, userId: string): string {
    return `${postId}_${userId}`;
  }
}
