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

import { type User } from "firebase/auth";

import { authService } from "../services/auth.service";
import { usersService } from "../services/users.service";
import {
  signUpSchema,
  type SignUpFormData,
} from "../shared/schemas/signup.schema";

import { useAuthStore } from "../stores/auth.store";

import { handleError } from "../shared/errors/handleError";
import { createGoogleProfile } from "../shared/utils/createGoogleProfile";
import { finishAuth } from "../shared/utils/finishAuth";

export const SignUpPage = () => {
  const navigate = useNavigate();

  const setUser = useAuthStore((s) => s.setUser);

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

  const rollbackFirebaseUser = async (firebaseUser: User | null) => {
    if (!firebaseUser) return;

    try {
      await firebaseUser.delete();
    } catch (err) {
      handleError(err);
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

      finishAuth(
        "Account created successfully. Please verify your email",
        navigate,
      );
    } catch (err) {
      await rollbackFirebaseUser(firebaseUser);

      handleError(err);
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      setGoogleLoading(true);

      const credential = await authService.signInWithGoogle();

      const firebaseUser = credential.user;

      if (!firebaseUser.uid) {
        throw new Error("Google user has no UID");
      }

      let user = await usersService.getById(firebaseUser.uid);

      if (user) {
        setUser(user);
        finishAuth(`Welcome back ${user.name}`, navigate);
        return;
      }

      const profile = createGoogleProfile(firebaseUser);

      user = await usersService.createProfile({ ...profile });

      setUser(user);
      finishAuth(`Welcome ${profile.name}!`, navigate);
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
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
