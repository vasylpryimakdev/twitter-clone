import { Avatar, IconButton, Box, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useRef } from "react";

type Props = {
  src?: string;
  isOwner: boolean;
  onAvatarChange?: (file: File) => void;
  loading?: boolean;
};

export const EditableAvatar = ({
  src,
  isOwner,
  onAvatarChange,
  loading = false,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isOwner || loading) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAvatarChange) return;

    onAvatarChange(file);
  };

  return (
    <Box sx={{ position: "relative", width: 120, height: 120, mt: -7.5 }}>
      <Avatar
        src={src}
        sx={{
          width: 120,
          height: 120,
          border: "4px solid white",
        }}
      />

      {isOwner && (
        <IconButton
          onClick={handleClick}
          sx={{
            position: "absolute",
            bottom: 6,
            right: 6,
            width: 34,
            height: 34,
            backgroundColor: "rgba(0,0,0,0.45)",
            color: "white",
            border: "2px solid white",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.6)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={16} sx={{ color: "white" }} />
          ) : (
            <EditIcon fontSize="small" />
          )}
        </IconButton>
      )}

      <input
        type="file"
        ref={inputRef}
        hidden
        accept="image/*"
        onChange={handleFileChange}
      />
    </Box>
  );
};
