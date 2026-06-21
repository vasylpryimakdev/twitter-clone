import { Routes, Route } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage";
import { MainLayout } from "../components/MainLayout";

import { HomePage } from "../pages/HomePage";
import { UserPage } from "../pages/UserPage";
import { SignUpPage } from "../pages/SignUpPage";
import { ProfilePage } from "../pages/ProfilePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProtectedRoute } from "./ProtectedRoute";
import PostFormPage from "../pages/PostFormPage";
import { ProfileMeRedirect } from "../components/profile/ProfileMeRedirect";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile/me" element={<ProfileMeRedirect />} />
          <Route path="/posts/new" element={<PostFormPage />} />
          <Route path="/posts/edit/:id" element={<PostFormPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
