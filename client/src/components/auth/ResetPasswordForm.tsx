import { Stack, TextField, Button, Typography } from "@mui/material";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useToastStore } from "../../stores/toast.store";
import { authService } from "../../services/auth.service";
import { handleError } from "../../shared/errors/handleError";

type Props = {
  email: string;
  onEmailChange: Dispatch<SetStateAction<string>>;
  onBack: () => void;
};

export const ResetPasswordForm = ({ email, onEmailChange, onBack }: Props) => {
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement | null>(null);

  const showToast = useToastStore.getState().showToast;

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleReset = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await authService.sendPasswordReset(email);

      showToast("If an account exists, a reset email was sent.", "success");
      onBack();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset}>
      <fieldset
        disabled={loading}
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Reset password
          </Typography>
          <TextField
            label="Email"
            value={email}
            inputRef={emailRef}
            onChange={(e) => onEmailChange(e.target.value)}
            fullWidth
          />

          <Typography variant="body2" color="text.secondary">
            Enter your email and we will send you a password reset link.
          </Typography>

          <Button
            type="submit"
            loading={loading}
            variant="contained"
            disabled={loading}
          >
            Send reset link
          </Button>

          <Button size="small" onClick={onBack}>
            Back to login
          </Button>
        </Stack>
      </fieldset>
    </form>
  );
};
