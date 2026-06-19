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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { authService } from "../services/auth.service";
import {
  loginSchema,
  type LoginFormData,
} from "../shared/schemas/login.schema";
import { useToastStore } from "../stores/toast.store";
import { handleError } from "../shared/errors/handleError";

type AuthMode = "login" | "reset";

export const LoginPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setFocus("email");
  }, [mode, setFocus]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (mode === "login") {
        await authService.login(data.email, data.password);

        showToast("Welcome back 👋", "success");

        navigate("/", { replace: true });

        return;
      }

      await authService.sendPasswordReset(data.email);

      showToast("If an account exists, a reset email was sent.", "success");

      setMode("login");

      reset({
        email: data.email,
        password: "",
      });
    } catch (err) {
      handleError(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await authService.loginWithGoogle();

      showToast("Signed in with Google", "success");

      navigate("/", { replace: true });
    } catch (err) {
      handleError(err);
    } finally {
      setGoogleLoading(false);
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
            <fieldset
              disabled={isSubmitting || googleLoading}
              style={{
                border: 0,
                padding: 0,
                margin: 0,
                minWidth: 0,
              }}
            >
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
                    <Button size="small" onClick={() => setMode("reset")}>
                      Forgot password?
                    </Button>
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {mode === "login" ? "Login" : "Send reset link"}
                </Button>

                {mode === "reset" && (
                  <Button size="small" onClick={() => setMode("login")}>
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
                      loading={googleLoading}
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
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
