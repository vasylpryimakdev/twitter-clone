import { Avatar, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useRef } from "react";

type Props = {
  src?: string;
  onChange: (file: File) => void;
};

export const EditableAvatar = ({ src, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange(file);
  };

  return (
    <Box sx={{ position: "relative", width: 120, height: 120 }}>
      <Avatar
        src={src}
        sx={{
          width: 120,
          height: 120,
          border: "4px solid white",
        }}
      />

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

          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
          transition: "0.2s ease",
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>

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
