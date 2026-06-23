import { Box, Card, CardContent } from "@mui/material";
import {} from "react-router-dom";
import { useState } from "react";

import { LoginForm } from "../components/auth/LoginForm";
import { ResetPasswordForm } from "../components/auth/ResetPasswordForm";

type AuthMode = "login" | "reset";

export const LoginPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");

  return (
    <Box sx={{ alignSelf: "center" }}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          {mode === "login" ? (
            <LoginForm
              email={email}
              onEmailChange={setEmail}
              onForgotPassword={() => setMode("reset")}
            />
          ) : (
            <ResetPasswordForm
              email={email}
              onEmailChange={setEmail}
              onBack={() => setMode("login")}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
