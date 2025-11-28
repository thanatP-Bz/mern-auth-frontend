import { useEffect } from "react";
import taskApi from "../api/taskApi";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
  const { tasks, dispatch } = useTaskContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const taskData = await taskApi(user.token);
        console.log(taskData);
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
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
};

export default Home;
