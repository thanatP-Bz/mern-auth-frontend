import { StrictMode } from "react";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { TaskContextProvider } from "./context/TaskContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <TaskContextProvider>
        <App />
      </TaskContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
