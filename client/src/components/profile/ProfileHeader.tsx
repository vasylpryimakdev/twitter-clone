import type { UserProfile } from "../../types/user.types";
import { ProfileHeaderContainer } from "./profileHeader/ProfileHeaderContainer";
import { ProfileHeaderView } from "./profileHeader/ProfileHeaderView";

type Props = {
  user: UserProfile;
  isOwner: boolean;
  emailVerified?: boolean;
};

export const ProfileHeader = ({ user, isOwner, emailVerified }: Props) => {
  return (
    <>
      {isOwner ? (
        <ProfileHeaderContainer
          user={user}
          isOwner={isOwner}
          emailVerified={emailVerified}
        />
      ) : (
        <ProfileHeaderView user={user} isOwner={isOwner} />
      )}
    </>
  );
};
