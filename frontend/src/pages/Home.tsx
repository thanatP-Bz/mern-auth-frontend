import { useEffect } from "react";
import { fetchTasks } from "../api/taskApi";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import Navbar from "../components/Navbar";

const Home = () => {
  const { tasks, dispatch } = useTaskContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const getTasks = async () => {
      if (!user) return;
      try {
        const task = await fetchTasks(user.token);

        dispatch({ type: "SET_TASKS", payload: task });
      } catch (error) {
        console.log("Failed to get tasks", error);
      }
    };
    getTasks();
  }, [user, dispatch]);

  return (
    <div>
      <Navbar />
      <TaskCard tasks={tasks} />

      <TaskForm />
    </div>
  );
};

export default Home;
