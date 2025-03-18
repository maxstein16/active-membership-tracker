import React from "react";
import "../src/assets/css/constants.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/**
 * HOW TO ADD A NEW PAGE
 *
 * Import the page below, and add it in the router const with an appropriate path,
 * then add it to the server layer under routes/serve-frontend
 */
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import UserProfilePage from "./pages/MemberPages/UserProfilePage.jsx";
import EditProfilePage from "./pages/MemberPages/EditProfilePage.jsx";
import SettingsPage from "./pages/AdminEboardPages/SettingsPage.jsx";
import ReportsPage from "./pages/AdminEboardPages/ReportsPage.jsx";
import CreateOrganizationPage from "./pages/AdminEboardPages/CreateOrganizationPage.jsx";
import OrganizationStatusPage from "./pages/MemberPages/OrganizationStatusPage.jsx";
import GrantPrivilegePage from "./pages/AdminEboardPages/GrantPrivilegePage.jsx";
import EventsPage from "./pages/EventsPage.jsx";

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
      path: ":orgId/status",
      element: <OrganizationStatusPage />,
    },
    {
      path: ":orgId/events",
      element: <EventsPage />,
    },
    {
      path: "/:orgId/settings",
      element: <SettingsPage />,
    },
    {
      path: "/:orgId/reports",
      element: <ReportsPage />,
    },
    {
      path: "/createOrg",
      element: <CreateOrganizationPage />,
    },
    {
      path: "/grantPrivilege",
      element: <GrantPrivilegePage />,
    },
  ]);

  return (
    <RouterProvider router={router}>
        <DashboardPage />
    </RouterProvider>
  );
};
