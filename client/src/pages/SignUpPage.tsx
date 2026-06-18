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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";

import { authService } from "../services/auth.service";
import { usersService } from "../services/users.service";
import { signUpSchema, type SignUpFormData } from "../schemas/signup.schema";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import type { ApiError } from "../types/api-error.type";
import { useToastStore } from "../stores/toast.store";
import axios from "axios";
import { AUTH_ERRORS } from "../constants/errors";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const showToast = useToastStore((state) => state.showToast);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const credential = await authService.signUp(data.email, data.password);
      const user = await usersService.createProfile({
        name: data.name,
        surname: data.surname,
        username: data.username.toLowerCase(),
      });

      setUser({
        ...user,
        id: credential.user.uid,
        emailVerified: credential.user.emailVerified,
      });

      showToast(
        "Account created successfully. Please verify your email 📧",
        "success",
      );

      navigate("/", { replace: true });
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err)) {
        showToast(
          err.response?.data?.message ?? "Something went wrong",
          "error",
        );
      } else if (
        err instanceof Error &&
        err.message === AUTH_ERRORS.MAIL_ALREADY_IN_USE
      ) {
        showToast("Email is already in use", "error");
      } else {
        showToast("Something went wrong", "error");
      }

      console.error(err);
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      const googleUser = await authService.signInWithGoogle();

      const user = googleUser.user;

      const displayName = user.displayName?.trim() || "";
      const email = user.email || "";
      const uidPart = user.uid.slice(0, 6).toLowerCase();

      const [name = "", surname = ""] = displayName.split(" ");

      const base = displayName || email.split("@")[0] || "user";

      const cleanBase = base
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9_]/g, "");

      const username = `${cleanBase || "user"}_${uidPart}`;

      const createdUser = await usersService.createProfile({
        name,
        surname,
        username,
      });

      setUser(createdUser);
      showToast("Signed up with Google 🎉", "success");

      navigate("/", { replace: true });
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err)) {
        console.log("hi");

        showToast(
          err.response?.data?.message ?? "Something went wrong!",
          "error",
        );
      } else if (err instanceof Error) {
        if (err.message === AUTH_ERRORS.GOOGLE_ALREADY_REGISTERED) {
          showToast(
            "This account already exists. Please login instead.",
            "error",
          );

          return;
        } else {
          showToast("Something went wrong!", "error");
        }
      }
    }
  };

  return (
    <Box sx={{ alignSelf: "center" }}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Create account
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((p) => !p)}
                          edge="end"
                        >
                          {!showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Confirm password"
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirm((p) => !p)}
                          edge="end"
                        >
                          {!showConfirm ? <VisibilityOff /> : <Visibility />}
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

              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Sign Up"}
              </Button>

              <Divider sx={{ my: 1 }}>OR</Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleRegisterWithGoogle}
              >
                Continue with Google
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
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
