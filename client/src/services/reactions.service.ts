import { api } from "../api/api";

export type ReactionType = "like" | "dislike";

class ReactionsService {
  async react(postId: string, type: ReactionType): Promise<void> {
    await api.post(`/posts/${postId}/reactions`, { type });
  }
}

export const reactionsService = new ReactionsService();
