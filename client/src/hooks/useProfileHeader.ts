import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserProfile } from "../types/user.types";
import {
  profileEditSchema,
  type ProfileEditForm,
} from "../shared/schemas/profileEdit.schema";
import { usersService } from "../services/users.service";
import { handleError } from "../shared/errors/handleError";
import { uploadImage } from "../services/storage.service";
import { useUser } from "./useUser";

export const useProfileHeader = (user: UserProfile) => {
  const { invalidateUser } = useUser(user.id);

  const [isEditing, setIsEditing] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const form = useForm<ProfileEditForm>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      username: user.username,
      avatar: user.avatar ?? null,
    },
  });

  const getChangedFields = (data: ProfileEditForm) => {
    const changes: Partial<ProfileEditForm> = {};

    if (data.name?.trim() !== user.name) {
      changes.name = data.name;
    }

    if (data.surname?.trim() !== user.surname) {
      changes.surname = data.surname;
    }

    if (data.username?.trim() !== user.username) {
      changes.username = data.username;
    }

    return changes;
  };

  const onUpdateUser = async (data: ProfileEditForm) => {
    const changes = getChangedFields(data);

    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      await usersService.updateProfile(changes);

      invalidateUser();
      setIsEditing(false);
    } catch (e) {
      handleError(e);
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (avatarLoading) return;

    try {
      setAvatarLoading(true);

      const uploaded = await uploadImage(file);

      await usersService.updateProfile({
        avatar: {
          url: uploaded.url,
          path: uploaded.path,
          type: "upload",
        },
      });

      invalidateUser();
    } catch (e) {
      handleError(e);
    } finally {
      setAvatarLoading(false);
    }
  };

  return {
    state: {
      isEditing,
      avatarLoading,
      anchorEl,
      isDeleteModalOpen,
      isChangePasswordOpen,
    },
    actions: {
      setIsEditing,
      setAnchorEl,
      setIsDeleteModalOpen,
      setIsChangePasswordOpen,
      handleAvatarChange,
      onUpdateUser,
    },
    form,
  };
};
