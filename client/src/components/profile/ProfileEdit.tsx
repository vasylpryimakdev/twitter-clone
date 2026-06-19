import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { Box, TextField, IconButton } from "@mui/material";
import type { ProfileEditForm } from "../../shared/schemas/profileEdit.schema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  register: UseFormRegister<ProfileEditForm>;
  errors: FieldErrors<ProfileEditForm>;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
};

export const ProfileEdit = ({
  register,
  errors,
  onSave,
  onCancel,
  isSaving,
}: Props) => {
  return (
    <Box
      component="form"
      onSubmit={onSave}
      sx={{
        flex: 1,
        py: 2,
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          alignItems: "start",
        }}
      >
        <TextField
          size="small"
          label="First name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          size="small"
          label="Last name"
          {...register("surname")}
          error={!!errors.surname}
          helperText={errors.surname?.message}
        />

        <Box sx={{ gridColumn: "1 / -1" }}>
          <TextField
            size="small"
            label="Username"
            fullWidth
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <IconButton
          sx={{ color: "text.secondary" }}
          onClick={onCancel}
          disabled={isSaving}
        >
          <CloseIcon />
        </IconButton>

        <IconButton
          type="submit"
          sx={{ color: "text.secondary" }}
          disabled={isSaving}
        >
          {isSaving ? (
            <CircularProgress size={18} sx={{ color: "text.secondary" }} />
          ) : (
            <CheckIcon />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};
