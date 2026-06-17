import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Stack, TextField, IconButton } from "@mui/material";
import type { ProfileEditForm } from "../../schemas/profileEdit.schema";
import type { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<ProfileEditForm>;
  onSave: () => void;
  onCancel: () => void;
};

export const ProfileEdit = ({ register, onSave, onCancel }: Props) => {
  return (
    <Box sx={{ flex: 1, py: 2 }}>
      <Stack
        sx={{
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <TextField size="small" {...register("name")} />
        <TextField size="small" {...register("surname")} />

        <Stack direction="row">
          <IconButton onClick={onSave} color="success">
            <CheckIcon />
          </IconButton>

          <IconButton onClick={onCancel} color="error">
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ mt: 1 }}>
        <TextField size="small" {...register("username")} />
      </Box>
    </Box>
  );
};
