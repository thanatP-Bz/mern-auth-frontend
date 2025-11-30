import axios from "axios";
import type { Task } from "../reducer/taskReducer";

interface TaskApiResponse {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export const fetchTasks = async (token: string): Promise<Task[]> => {
  const res = await axios.get("http://localhost:4004/api/task/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.data.map((task: any) => ({
    id: task._id,
    title: task.title,
    description: task.description,
    completed: task.isCompleted,
  }));
};

export const createTask = async (
  token: string,
  data: { title: string; description: string; isCompleted: boolean }
): Promise<TaskApiResponse> => {
  const res = await axios.post("http://localhost:4004/api/task/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    _id: res.data.task.id,
    title: res.data.task.title,
    description: res.data.task.description,
    isCompleted: res.data.task.isCompleted,
  };
};
