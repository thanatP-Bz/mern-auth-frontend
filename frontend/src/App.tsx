import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/password/ResetPassword";
import ForgetPassword from "./pages/password/ForgetPassword";
import TaskDetail from "./components/TaskDetail";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/PotectedRoute";

const router = createBrowserRouter([
  { path: "auth", element: <Auth /> },
  { path: "register", element: <Register /> },
  { path: "login", element: <Login /> },
  { path: "forget-password", element: <ForgetPassword /> },
  { path: "reset-password/:token", element: <ResetPassword /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  { path: "task/:id", element: <TaskDetail /> },
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
