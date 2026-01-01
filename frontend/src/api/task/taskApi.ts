import axiosInstance from "@/utils/axiosInstance";
import type { Task } from "../../reducer/taskReducer";
import { TaskMapper } from "../../types/taskMapper";

// ✅ No token parameter needed - interceptor adds it automatically!
export const fetchTasks = async (): Promise<Task[]> => {
  const res = await axiosInstance.get("task/");

  return res.data.map(TaskMapper);
};

// ✅ No token parameter needed
export const createTask = async (data: {
  title: string;
  description: string;
  isCompleted: boolean;
}): Promise<Task> => {
  const res = await axiosInstance.post("/task/", data);
  return TaskMapper(res.data);
};

// ✅ No token parameter needed
export const fetchCurrentTask = async (id: string): Promise<Task> => {
  const res = await axiosInstance.get(`/task/${id}`);
  return TaskMapper(res.data);
};

// ✅ No token parameter needed
export const updateTask = async (
  id: string,
  data: { title: string; description: string; isCompleted: boolean }
): Promise<Task> => {
  const res = await axiosInstance.patch(`/task/${id}`, data);
  return TaskMapper(res.data);
};

// ✅ No token parameter needed
export const deleteTask = async (id: string) => {
  await axiosInstance.delete(`/task/${id}`);
};
