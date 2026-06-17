import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authService } from "../services/auth.service";
import { usersService } from "../services/users.service";
import { signUpSchema, type SignUpFormData } from "../schemas/signup.schema";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import GoogleIcon from "@mui/icons-material/Google";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await authService.signUp(data.email, data.password);

      const user = await usersService.createProfile({
        name: data.name,
        surname: data.surname,
        username: data.username.toLowerCase(),
      });

      setUser(user);

      navigate("/", { replace: true });
    } catch (err: unknown) {
      console.error("UNKNOWN ERROR:", err);
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      const googleUser = await authService.loginWithGoogle();

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

      console.log(createdUser);

      setUser(createdUser);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Google auth error:", err);
    }
  };

  return (
    <Box
      sx={{
        mt: "50%",
      }}
    >
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
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
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

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleRegisterWithGoogle}
              >
                Continue with Google
              </Button>

              <Box
                sx={{
                  mt: 2,
                  textAlign: "center",
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
