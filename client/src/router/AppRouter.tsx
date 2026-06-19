import { Routes, Route } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage";
import { MainLayout } from "../components/MainLayout";

import { HomePage } from "../pages/HomePage";
import { UserPage } from "../pages/UserPage";
import { SignUpPage } from "../pages/SignUpPage";
import { ProfilePage } from "../pages/ProfilePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
