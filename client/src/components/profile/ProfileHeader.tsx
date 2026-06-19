import { Stack, Box, IconButton } from "@mui/material";

import type { UserProfile } from "../../types/user.types";
import { useState } from "react";

import SettingsIcon from "@mui/icons-material/Settings";
import { ProfileEdit } from "./ProfileEdit";
import { ProfileView } from "./ProfileView";
import { useForm } from "react-hook-form";
import {
  profileEditSchema,
  type ProfileEditForm,
} from "../../shared/schemas/profileEdit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileSettingsMenu from "./ProfileSettingsMenu";
import { usersService } from "../../services/users.service";
import { useAuthStore } from "../../stores/auth.store";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { EditableAvatar } from "./EditableAvatar";

export const ProfileHeader = ({ user }: { user: UserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const setUser = useAuthStore((s) => s.setUser);

  const { register, handleSubmit, reset, formState } = useForm<ProfileEditForm>(
    {
      resolver: zodResolver(profileEditSchema),
      defaultValues: {
        name: user.name,
        surname: user.surname,
        username: user.username,
      },
    },
  );

  const handleCancel = () => {
    reset(user);
    setIsEditing(false);
  };

  const hasChanges = (data: ProfileEditForm) => {
    return (
      data.name.trim() !== user.name.trim() ||
      data.surname.trim() !== user.surname.trim() ||
      data.username.trim().toLowerCase() !== user.username.trim().toLowerCase()
    );
  };

  const onUpdateUser = async (data: ProfileEditForm) => {
    if (!hasChanges(data)) {
      setIsEditing(false);
      reset(user);

      return;
    }

    try {
      const updatedUser = await usersService.updateProfile(data);

      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <>
      <Box sx={{ height: 180, backgroundColor: "#cfd9de" }} />

      <Box sx={{ px: 3 }}>
        <Stack
          sx={{
            flexDirection: "row",
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              gap: 2,
              flex: 1,
              alignItems: "flex-start",
            }}
          >
            <EditableAvatar
              src={user.avatar}
              onChange={(file) => {
                console.log("selected file:", file);
              }}
            />

            {isEditing ? (
              <ProfileEdit
                register={register}
                errors={formState.errors}
                onSave={handleSubmit(onUpdateUser)}
                onCancel={handleCancel}
                isSaving={formState.isSubmitting}
              />
            ) : (
              <ProfileView user={user} onEdit={() => setIsEditing(true)} />
            )}

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <SettingsIcon />
            </IconButton>
            <ProfileSettingsMenu
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              onDeleteAccount={openDeleteModal}
              onChangePassword={() => setIsChangePasswordOpen(true)}
            />
            <DeleteAccountModal
              open={isDeleteModalOpen}
              onClose={closeDeleteModal}
            />
            <ChangePasswordModal
              open={isChangePasswordOpen}
              onClose={() => setIsChangePasswordOpen(false)}
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
