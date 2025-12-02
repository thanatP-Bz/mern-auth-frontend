import { useEffect } from "react";
import { fetchTasks } from "../api/taskApi";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";
import TaskForm from "../components/TaskForm";

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
        console.log("Failed to fetch tasks", error);
      }
    };
    getTasks();
  }, [user, dispatch]);

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Status: {task.isCompleted ? "✅ Completed" : "❌ Pending"}</p>
        </div>
      ))}

      <TaskForm />
    </div>
  );
};

export default Home;
