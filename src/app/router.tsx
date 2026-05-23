import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { AppShell } from "../components/layout/AppShell";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { NotificationsPage } from "../pages/NotificationsPage/NotificationsPage";
import { OrderDetailPage } from "../pages/OrderDetailPage/OrderDetailPage";
import { OrdersPage } from "../pages/OrdersPage/OrdersPage";
import { VerifyEmailPage } from "../pages/VerifyEmailPage/VerifyEmailPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/:trackingId", element: <DashboardPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/orders/:trackingId", element: <OrderDetailPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
