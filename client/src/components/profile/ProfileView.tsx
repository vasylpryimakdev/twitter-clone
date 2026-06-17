import EditIcon from "@mui/icons-material/Edit";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import type { ProfileEditForm } from "../../schemas/profileEdit.schema";

type Props = {
  form: ProfileEditForm;
  onEdit: () => void;
};

export const ProfileView = ({ form, onEdit }: Props) => {
  return (
    <Box sx={{ flex: 1, py: 1 }}>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {form.name} {form.surname}
          </Typography>

          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          @{form.username}
        </Typography>
      </Box>
    </Box>
  );
};
