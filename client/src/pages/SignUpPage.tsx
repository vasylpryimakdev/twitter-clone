import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authService } from "../services/auth.service";
import { usersService } from "../services/users.service";
import { signUpSchema, type SignUpFormData } from "../schemas/signup.schema";

export const SignUpPage = () => {
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

      await usersService.createProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username.toLowerCase(),
      });
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f8fa",
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
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />

              <TextField
                label="Last name"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
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
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
