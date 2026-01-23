import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/auth/Auth";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import TaskDetail from "./components/TaskDetail";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/PotectedRoute";
import { useAuthContext } from "./hooks/useAuthContext";
import VerifyEmail from "./pages/auth/VerifyEmail";
import { Verify2FA } from "./pages/auth/Verify2FA";
import Security from "./pages/auth/Security";
import OAuthCallback from "./pages/auth/OauthCallback";

// Root redirect
const RootRedirect = () => {
  const { user } = useAuthContext();
  return user ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/auth" replace />
  );
};

// Auth page wrapper
const AuthPage = () => {
  const { user } = useAuthContext();
  return user ? <Navigate to="/home" replace /> : <Auth />;
};

const router = createBrowserRouter([
  // Root
  {
    path: "/",
    element: <RootRedirect />,
  },

  // ========== PUBLIC ROUTES (No Navbar) ==========
  {
    element: <AuthLayout />,
    children: [
      { path: "auth", element: <AuthPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "verify-2fa", element: <Verify2FA /> },
      { path: "verify-email", element: <VerifyEmail /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      { path: "/auth/callback", element: <OAuthCallback /> },
    ],
  },

  // ========== PROTECTED ROUTES (With Navbar) ==========
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "security",
        element: (
          <ProtectedRoute>
            <Security />
          </ProtectedRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: "task/:id",
        element: (
          <ProtectedRoute>
            <TaskDetail />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
