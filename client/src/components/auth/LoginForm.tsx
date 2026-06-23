import {
  Box,
  Stack,
  TextField,
  Button,
  Link,
  Typography,
  Divider,
} from "@mui/material";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { authService } from "../../services/auth.service";
import { useToastStore } from "../../stores/toast.store";
import { deleteUser } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { usersService } from "../../services/users.service";
import { handleError } from "../../shared/errors/handleError";
import { isValidEmail } from "../../shared/utils/isValidEmail";

type Props = {
  email: string;
  onEmailChange: Dispatch<SetStateAction<string>>;
  onForgotPassword: () => void;
};

export const LoginForm = ({
  email,
  onEmailChange,
  onForgotPassword,
}: Props) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const emailRef = useRef<HTMLInputElement | null>(null);

  const showToast = useToastStore.getState().showToast;

  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate("/", { replace: true });
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await authService.loginWithGoogle();

      const user = await usersService.getMe();

      if (!user) {
        await deleteUser(auth.currentUser!);
        throw new Error("You are not registered in system");
      }

      showToast(`Welcome ${user.name} 👋`, "success");
      navigate("/", { replace: true });
    } catch (err) {
      handleError(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <fieldset
        disabled={loading || googleLoading}
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Login
          </Typography>
          <TextField
            label="Email"
            value={email}
            inputRef={emailRef}
            onChange={(e) => {
              onEmailChange(e.target.value);

              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
          />

          <Box sx={{ textAlign: "right" }}>
            <Button size="small" onClick={onForgotPassword}>
              Forgot password?
            </Button>
          </Box>

          <Button
            type="submit"
            loading={loading}
            variant="contained"
            disabled={loading}
          >
            Login
          </Button>

          <Divider>OR</Divider>

          <Button
            variant="outlined"
            loading={googleLoading}
            fullWidth
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don’t have an account?{" "}
              <Link
                component={RouterLink}
                to="/signup"
                underline="hover"
                sx={{ fontWeight: 500 }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Stack>
      </fieldset>
    </form>
  );
};
