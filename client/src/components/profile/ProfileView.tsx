import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import MailOutlineOutlined from "@mui/icons-material/MailOutlineOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";

type Props = {
  name: string;
  surname: string;
  username: string;
  emailVerified?: boolean | null;
  isOwner: boolean;
  onEdit?: () => void;
};

export const ProfileView = ({
  name,
  surname,
  username,
  isOwner,
  emailVerified,
  onEdit,
}: Props) => {
  const showEmailStatus = isOwner;

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
            {name} {surname}
          </Typography>

          {isOwner && (
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
          )}
        </Stack>
      </Stack>

      <Box
        sx={{
          mt: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          @{username}
        </Typography>

        {showEmailStatus && (
          <Tooltip
            title={emailVerified ? "Email verified" : "Email not verified"}
            arrow
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              badgeContent={
                emailVerified ? (
                  <CheckCircle sx={{ fontSize: 10, color: "white" }} />
                ) : (
                  <Cancel sx={{ fontSize: 10, color: "white" }} />
                )
              }
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: emailVerified
                    ? "success.main"
                    : "error.main",
                  width: 10,
                  height: 10,
                  minWidth: 10,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
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
        )}
      </Box>
    </Box>
  );
};
