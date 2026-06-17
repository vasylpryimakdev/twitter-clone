import { Avatar, Stack, Box, IconButton } from "@mui/material";

import type { UserProfile } from "../../types/user.types";
import { useState } from "react";

import SettingsIcon from "@mui/icons-material/Settings";
import { ProfileEdit } from "./ProfileEdit";
import { ProfileView } from "./ProfileView";
import { useForm, useWatch } from "react-hook-form";
import {
  profileEditSchema,
  type ProfileEditForm,
} from "../../schemas/profileEdit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileSettingsMenu from "./ProfileSettingsMenu";

export const ProfileHeader = ({ user }: { user: UserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [savedUser, setSavedUser] = useState(user);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { register, handleSubmit, reset, control, formState } =
    useForm<ProfileEditForm>({
      resolver: zodResolver(profileEditSchema),
      defaultValues: {
        name: user.name,
        surname: user.surname,
        username: user.username,
      },
    });

  const handleCancel = () => {
    reset(savedUser);
    setIsEditing(false);
  };

  const onSubmit = (data: ProfileEditForm) => {
    console.log("SAVE DATA:", data);

    setSavedUser((prev) => ({
      ...prev,
      ...data,
    }));
    setIsEditing(false);
  };

  const watched = useWatch({ control });

  const form = {
    name: watched.name ?? "",
    surname: watched.surname ?? "",
    username: (watched.username ?? "").toLowerCase(),
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
              />
            ) : (
              <ProfileView
                form={form}
                onEdit={() => setIsEditing(true)}
                emailVerified={user.verified}
              />
            )}

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <SettingsIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <ProfileSettingsMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </>
  );
};
