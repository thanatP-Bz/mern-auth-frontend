import App from "./App.tsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { TaskContextProvider } from "./context/TaskContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <TaskContextProvider>
      <App />
    </TaskContextProvider>
  </AuthContextProvider>
);
