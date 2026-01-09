import api from "../axios/axiosConfig";
import type { Task } from "../../reducer/taskReducer";
import { TaskMapper } from "../../types/taskMapper";

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await api.get("/api/task/");
  return res.data.map(TaskMapper);
};

export const createTask = async (data: {
  title: string;
  description: string;
  isCompleted: boolean;
}): Promise<Task> => {
  const res = await api.post("/api/task/", data);
  return TaskMapper(res.data);
};

export const fetchCurrentTask = async (id: string): Promise<Task> => {
  const res = await api.get(`/api/task/${id}`);
  return TaskMapper(res.data);
};

export const updateTask = async (
  id: string,
  data: { title: string; description: string; isCompleted: boolean }
): Promise<Task> => {
  const res = await api.patch(`/api/task/${id}`, data);
  return TaskMapper(res.data);
};

export const deleteTask = async (id: string) => {
  await api.delete(`/api/task/${id}`);
};
