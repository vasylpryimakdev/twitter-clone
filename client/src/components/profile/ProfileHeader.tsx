import type { UserProfile } from "../../types/user.types";
import { ProfileHeaderContainer } from "./profileHeader/ProfileHeaderContainer";
import { ProfileHeaderView } from "./profileHeader/ProfileHeaderView";

type Props = {
  user: UserProfile;
  isOwner: boolean;
};

export const ProfileHeader = ({ user, isOwner }: Props) => {
  return (
    <>
      {isOwner ? (
        <ProfileHeaderContainer user={user} isOwner={isOwner} />
      ) : (
        <ProfileHeaderView user={user} isOwner={isOwner} />
      )}
    </>
  );
};
