import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/auth/Auth";
import AuthLayout from "./components/AuthLayout";
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

// Root redirect - sends users to correct starting page
const RootRedirect = () => {
  const { user } = useAuthContext();

  if (user) {
    console.log("✅ User logged in, redirecting to /home");
    return <Navigate to="/home" replace />;
  }

  console.log("👤 No user, redirecting to /auth");
  return <Navigate to="/auth" replace />;
};

// Auth page wrapper - redirect if already logged in
const AuthPage = () => {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Auth />;
};

const router = createBrowserRouter([
  // Root - Redirects based on auth status
  {
    path: "/",
    element: <RootRedirect />,
  },

  // Protected home
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },

  // Auth routes - Using AuthLayout with Outlet
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      { path: "verify-2fa", element: <Verify2FA /> },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
    ],
  },

  //change passward

  {
    path: "/change-password",
    element: (
      <ProtectedRoute>
        <ChangePassword />
      </ProtectedRoute>
    ),
  },

  // Task detail - Protected
  {
    path: "/task/:id",
    element: (
      <ProtectedRoute>
        <TaskDetail />
      </ProtectedRoute>
    ),
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
