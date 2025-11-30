import { useEffect } from "react";
import { setTask } from "../api/taskApi";
import TaskForm from "../components/TaskForm";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
  const { tasks, dispatch } = useTaskContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const taskData = await setTask(user.token);

        dispatch({
          type: "SET_TASKS",
          payload: taskData.data,
        });
      } catch (error) {
        console.log("Failed to fetch tasks", error);
      }
    };
    fetchTasks();
  }, [user, dispatch]);

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
        <li>this is home page</li>
      </ul>

      <TaskForm />
    </div>
  );
};

export default Home;
