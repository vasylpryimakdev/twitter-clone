import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SignUpPage } from "../pages/SignUpPage";
import { UserPage } from "../pages/UserPage";
import { MainLayout } from "../components/MainLayout";
import { AuthRedirectHandler } from "../auth/AuthRedirectHandler";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthRedirectHandler />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/user/:id" element={<UserPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
