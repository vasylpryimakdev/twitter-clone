import { Box, IconButton, Stack } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import { EditableAvatar } from "../EditableAvatar";
import { ProfileEdit } from "../ProfileEdit";
import { ProfileView } from "../ProfileView";
import { ChangePasswordModal } from "../ChangePasswordModal";
import { DeleteAccountModal } from "../DeleteAccountModal";
import ProfileSettingsMenu from "../ProfileSettingsMenu";

import type { UserProfile } from "../../../types/user.types";
import { useProfileHeader } from "../../../hooks/useProfileHeader";

type Props = {
  user: UserProfile;
  isOwner: boolean;
  emailVerified?: boolean;
};

export const ProfileHeaderContainer = ({
  user,
  isOwner,
  emailVerified,
}: Props) => {
  const { state, actions, form } = useProfileHeader(user);

  const { register, handleSubmit, formState } = form;

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
          <EditableAvatar
            src={user.avatar?.url}
            onAvatarChange={actions.handleAvatarChange}
            loading={state.avatarLoading}
            isOwner={isOwner}
          />

          {state.isEditing ? (
            <ProfileEdit
              register={register}
              errors={formState.errors}
              onSave={handleSubmit(actions.onUpdateUser)}
              onCancel={() => actions.setIsEditing(false)}
              isSaving={formState.isSubmitting}
            />
          ) : (
            <ProfileView
              name={user.name}
              surname={user.surname}
              username={user.username}
              emailVerified={emailVerified}
              isOwner={true}
              onEdit={() => actions.setIsEditing(true)}
            />
          )}

          <IconButton onClick={(e) => actions.setAnchorEl(e.currentTarget)}>
            <SettingsIcon />
          </IconButton>

          <ProfileSettingsMenu
            anchorEl={state.anchorEl}
            setAnchorEl={actions.setAnchorEl}
            onDeleteAccount={() => actions.setIsDeleteModalOpen(true)}
            onChangePassword={() => actions.setIsChangePasswordOpen(true)}
          />

          <DeleteAccountModal
            open={state.isDeleteModalOpen}
            onClose={() => actions.setIsDeleteModalOpen(false)}
          />

          <ChangePasswordModal
            open={state.isChangePasswordOpen}
            onClose={() => actions.setIsChangePasswordOpen(false)}
          />
        </Stack>
      </Box>
    </>
  );
};
