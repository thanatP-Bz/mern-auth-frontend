import axios from "axios";
import type { Task } from "../reducer/taskReducer";
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
): Promise<Task> => {
  const res = await axios.post("http://localhost:4004/api/task/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return TaskMapper(res.data);
};

export const fetchCurrentTask = async (
  id: string,
  token: string
): Promise<Task> => {
  const res = await axios.get(`http://localhost:4004/api/task/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return TaskMapper(res.data);
};

export const updateTask = async (
  id: string,
  token: string,
  data: { title: string; description: string; isCompleted: boolean }
): Promise<Task> => {
  const res = await axios.patch(`http://localhost:4004/api/task/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return TaskMapper(res.data);
};
