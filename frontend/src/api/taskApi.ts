import axios from "axios";
import type { Task } from "../reducer/taskReducer";
import type { TaskApiResponse } from "../types/taskApiResponse";
import { TaskMapper } from "../types/taskMapper";

export const fetchTasks = async (token: string): Promise<Task[]> => {
  const res = await axios.get("http://localhost:4004/api/task/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.map(TaskMapper);
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
