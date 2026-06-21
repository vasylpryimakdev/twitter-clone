export type UserAvatar = {
  url: string;
  path?: string;
  type: "google" | "upload";
} | null;

export interface AuthorSnapshot {
  id: string;
  name: string;
  surname: string;
  username: string;
  avatar?: UserAvatar;
}
