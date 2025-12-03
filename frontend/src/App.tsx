import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TaskDetail from "./components/TaskDetail";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/task/:id", element: <TaskDetail /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
