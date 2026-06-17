import { Modal, Paper, Typography, Button } from "@mui/material";

type Props = {
  settingsOpen: boolean;
  setSettingsOpen: (value: boolean) => void;
};

const ProfileSettingsModal = ({ settingsOpen, setSettingsOpen }: Props) => {
  return (
    <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
      <Paper
        sx={{
          width: 320,
          p: 3,
          mx: "auto",
          mt: "20vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6">Account settings</Typography>

        <Button variant="outlined">Change password</Button>
        <Button variant="outlined">Verify email</Button>
        <Button color="error" variant="contained">
          Delete account
        </Button>
      </Paper>
    </Modal>
  );
};

export default ProfileSettingsModal;
