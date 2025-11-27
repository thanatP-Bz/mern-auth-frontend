import { useEffect } from "react";
import taskApi from "../api/taskApi";
import type { Task } from "../reducer/taskReducer";
import { useTaskContext } from "../hooks/useTaskContext";

const Home = () => {
  const { tasks, dispatch } = useTaskContext();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskApi.get<Task[]>("/");

        dispatch({
          type: "SET_TASKS",
          payload: response.data,
        });
      } catch (error) {
        console.log("Failed to fetch tasks", error);
      }
    };
    fetchTasks();
  }, [dispatch]);

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
};

export default Home;
