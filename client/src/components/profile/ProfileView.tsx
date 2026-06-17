import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import type { ProfileEditForm } from "../../schemas/profileEdit.schema";
import MailOutlineOutlined from "@mui/icons-material/MailOutlineOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";

type Props = {
  form: ProfileEditForm;
  onEdit: () => void;
  emailVerified: boolean;
};

export const ProfileView = ({ form, emailVerified, onEdit }: Props) => {
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

      <Box
        sx={{
          mt: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          @{form.username}
        </Typography>

        <Tooltip
          title={emailVerified ? "Email verified" : "Email not verified"}
          arrow
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              emailVerified ? (
                <CheckCircle sx={{ fontSize: 10, color: "white" }} />
              ) : (
                <Cancel sx={{ fontSize: 10, color: "white" }} />
              )
            }
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: emailVerified ? "success.main" : "error.main",
                width: 14,
                height: 14,
                minWidth: 14,
                borderRadius: "50%",
              },
            }}
          >
            <MailOutlineOutlined
              sx={{
                fontSize: 18,
                color: emailVerified ? "success.main" : "error.main",
              }}
            />
          </Badge>
        </Tooltip>
      </Box>
    </Box>
  );
};
