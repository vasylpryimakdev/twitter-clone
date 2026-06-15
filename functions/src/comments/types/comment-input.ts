export type CommentInput = {
  id: string;
  postId: string;
  userId: string;
  parentId: string | null;
  text: string;
};
