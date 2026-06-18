import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  Link,
  Divider,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { authService } from "../services/auth.service";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { useToastStore } from "../stores/toast.store";

export const LoginPage = () => {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);

  const {
    register,
    handleSubmit,
    control,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = useWatch({
    control,
    name: "email",
  });

  useEffect(() => {
    if (mode === "reset") {
      setFocus("email");
    }
  }, [mode, setFocus]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authService.login(data.email, data.password);

      showToast("Welcome back 👋", "success");

      navigate("/", { replace: true });
    } catch (err) {
      showToast("Invalid email or password", "error");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle();

      showToast("Signed in with Google", "success");

      navigate("/", { replace: true });
    } catch (err) {
      showToast("Google login failed", "error");
      console.error(err);
    }
  };

  const handleForgotPasswordClick = () => {
    setMode("reset");
  };

  const handleBackToLogin = () => {
    setMode("login");
  };

  const handleForgotPassword = async () => {
    if (!emailValue) return;

    try {
      setResetLoading(true);

      await authService.sendPasswordReset(emailValue);

      showToast("If an account exists, a reset email was sent.", "success");

      setMode("login");

      reset({ email: emailValue, password: "" });
    } catch (err) {
      showToast("Failed to send reset email", "error");
      console.error(err);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Box sx={{ alignSelf: "center" }}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {mode === "login" ? "Login" : "Reset password"}
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              {mode === "login" && (
                <TextField
                  label="Password"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}

              {mode === "reset" && (
                <Typography variant="body2" color="text.secondary">
                  Enter your email and we will send you a password reset link.
                </Typography>
              )}

              {mode === "login" && (
                <Box sx={{ textAlign: "right" }}>
                  <Button size="small" onClick={handleForgotPasswordClick}>
                    Forgot password?
                  </Button>
                </Box>
              )}

              {mode === "login" ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleForgotPassword}
                  disabled={!emailValue || resetLoading}
                >
                  {resetLoading ? "Sending..." : "Send reset link"}
                </Button>
              )}

              {mode === "reset" && (
                <Button size="small" onClick={handleBackToLogin}>
                  Back to login
                </Button>
              )}

              {mode === "login" && (
                <>
                  <Divider>OR</Divider>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleGoogleLogin}
                  >
                    Continue with Google
                  </Button>
                </>
              )}

              {mode === "login" && (
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
              )}
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
