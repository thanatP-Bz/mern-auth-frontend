import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TaskDetail from "./components/TaskDetail";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/PotectedRoute";

const router = createBrowserRouter([
  { path: "/auth", element: <Auth /> },
  { path: "register", element: <Register /> },
  { path: "login", element: <Login /> },
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
