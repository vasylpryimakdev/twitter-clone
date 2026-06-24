import { Box, Stack } from "@mui/material";
import { EditableAvatar } from "../EditableAvatar";
import { ProfileView } from "../ProfileView";
import type { UserProfile } from "../../../types/user.types";

type Props = {
  user: UserProfile;
  isOwner: boolean;
};

export const ProfileHeaderView = ({ user, isOwner }: Props) => {
  return (
    <>
      <Box sx={{ height: 180, backgroundColor: "#cfd9de" }} />

      <Box
        sx={{
          px: 3,
          borderLeft: "1px solid",
          borderRight: "1px solid",
          borderColor: "divider",
          borderTop: 0,
          borderBottom: 0,
          borderRadius: 0,
        }}
      >
        <Stack sx={{ gap: 2, alignItems: "flex-start" }} direction="row">
          <EditableAvatar src={user.avatar?.url} isOwner={isOwner} />

          <ProfileView
            name={user.name}
            surname={user.surname}
            username={user.username}
            isOwner={isOwner}
            onEdit={() => {}}
          />
        </Stack>
      </Box>
    </>
  );
};
