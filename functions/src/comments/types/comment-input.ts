export type CommentInput = {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  text: string;
};
