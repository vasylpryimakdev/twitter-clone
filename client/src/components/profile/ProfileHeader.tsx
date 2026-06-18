import { Avatar, Stack, Box, IconButton } from "@mui/material";

import type { UserProfile } from "../../types/user.types";
import { useState } from "react";

import SettingsIcon from "@mui/icons-material/Settings";
import { ProfileEdit } from "./ProfileEdit";
import { ProfileView } from "./ProfileView";
import { useForm } from "react-hook-form";
import {
  profileEditSchema,
  type ProfileEditForm,
} from "../../schemas/profileEdit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileSettingsMenu from "./ProfileSettingsMenu";
import { usersService } from "../../services/users.service";
import { useAuthStore } from "../../stores/auth.store";

export const ProfileHeader = ({ user }: { user: UserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
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

  const onSubmit = async (data: ProfileEditForm) => {
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
            <Avatar
              src={user.avatar}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
                mt: -7.5,
              }}
            />

            {isEditing ? (
              <ProfileEdit
                register={register}
                errors={formState.errors}
                onSave={handleSubmit(onSubmit)}
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
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
