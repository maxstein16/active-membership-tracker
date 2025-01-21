import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/**
 * HOW TO ADD A NEW PAGE
 *
 * Import the page below, and add it in the router const with an appropriate path
 */
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import UserProfilePage from "./pages/MemberPages/UserProfilePage.jsx";
import EditProfilePage from "./pages/MemberPages/EditProfilePage.jsx";
import AdminPage from "./pages/AdminEboardPages/AdminPage.jsx";

export const Router = () => {
  // all the pages you can navigate to
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/profile",
      element: <UserProfilePage />,
    },
    {
      path: "/profile/edit",
      element: <EditProfilePage />,
    },
    {
      path: "/admin",
      element: <AdminPage />,
    },
  ]);

  return (
    <RouterProvider router={router}>
      <DashboardPage />
    </RouterProvider>
  );
};
