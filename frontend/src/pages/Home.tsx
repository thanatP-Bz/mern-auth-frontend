import { useEffect } from "react";
import { fetchTasks } from "../api/task/taskApi";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Navbar from "../components/Navbar";
import Task from "./Task";

const Home = () => {
  const { dispatch } = useTaskContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const getTasks = async () => {
      try {
        const tasks = await fetchTasks();
        console.log("✅ Tasks fetched successfully:", tasks);
        dispatch({ type: "SET_TASKS", payload: tasks });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("❌ Failed to get tasks:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
      }
    };
    getTasks();
  }, [user, dispatch]);

  return (
    <div>
      <Navbar />
      <Task />
    </div>
  );
};

export default Home;
