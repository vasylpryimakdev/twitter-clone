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
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";

import type { User } from "firebase/auth";

import { authService } from "../services/auth.service";
import { usersService } from "../services/users.service";
import {
  signUpSchema,
  type SignUpFormData,
} from "../shared/schemas/signup.schema";

import { useAuthStore } from "../stores/auth.store";
import { useToastStore } from "../stores/toast.store";

import { handleError } from "../shared/errors/handleError";
import { createGoogleProfile } from "../shared/utils/createGoogleProfile";

export const SignUpPage = () => {
  const navigate = useNavigate();

  const setUser = useAuthStore((s) => s.setUser);
  const showToast = useToastStore((s) => s.showToast);

  const [googleLoading, setGoogleLoading] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const togglePassword = (field: "password" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const finishAuth = (message: string) => {
    showToast(message, "success");
    navigate("/", { replace: true });
  };

  const rollbackFirebaseUser = async (firebaseUser: User | null) => {
    if (!firebaseUser) return;

    try {
      await firebaseUser.delete();
    } catch (err) {
      console.error("Failed to rollback auth user", err);
    }
  };

  const registerWithMail = async (data: SignUpFormData) => {
    let firebaseUser: User | null = null;

    try {
      const credential = await authService.signUp(data.email, data.password);

      firebaseUser = credential.user;

      const user = await usersService.createProfile({
        name: data.name,
        surname: data.surname,
        username: data.username.toLowerCase(),
      });

      setUser({
        ...user,
        id: firebaseUser.uid,
        emailVerified: firebaseUser.emailVerified,
      });

      finishAuth("Account created successfully. Please verify your email 📧");
    } catch (err) {
      await rollbackFirebaseUser(firebaseUser);

      handleError(err);
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      setGoogleLoading(true);

      const googleUser = await authService.signInWithGoogle();

      const profile = createGoogleProfile(googleUser.user);

      const createdUser = await usersService.createProfile(profile);

      setUser(createdUser);

      finishAuth("Signed up with Google 🎉");
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
            Create account
          </Typography>

          <form onSubmit={handleSubmit(registerWithMail)}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Password"
                type={showPasswords.password ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => togglePassword("password")}
                        >
                          {showPasswords.password ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Confirm password"
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => togglePassword("confirm")}
                        >
                          {showPasswords.confirm ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="First name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField
                label="Last name"
                {...register("surname")}
                error={!!errors.surname}
                helperText={errors.surname?.message}
              />

              <TextField
                label="Username"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ height: 40 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Sign Up"
                )}
              </Button>

              <Divider sx={{ my: 1 }}>OR</Divider>

              <Button
                type="button"
                fullWidth
                variant="outlined"
                onClick={handleRegisterWithGoogle}
                disabled={googleLoading}
                startIcon={!googleLoading && <GoogleIcon />}
                sx={{ height: 40 }}
              >
                {googleLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Continue with Google"
                )}
              </Button>

              <Box
                sx={{
                  textAlign: "center",
                  mt: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    underline="hover"
                    sx={{ fontWeight: 500 }}
                  >
                    Log in
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
