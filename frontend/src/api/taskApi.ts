import axiosInstance from "@/utils/axiosInstance";
import type { Task } from "../reducer/taskReducer";
import { TaskMapper } from "../types/taskMapper";

export const fetchTasks = async (/* token: string */): Promise<Task[]> => {
  const res = await axiosInstance.get("/task/", {
    /*   headers: {
      Authorization: `Bearer ${token}`,
    }, */
  });

  return res.data.map(TaskMapper);
};

export const createTask = async (
  token: string,
  data: { title: string; description: string; isCompleted: boolean }
): Promise<Task> => {
  const res = await axiosInstance.post("/task/", data, {
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
  const res = await axiosInstance.get(`/task/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return TaskMapper(res.data);
};

export const updateTask = async (
  id: string,
  token: string,
  data: { title: string; description: string; isCompleted: boolean }
): Promise<Task> => {
  const res = await axiosInstance.patch(`/task/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return TaskMapper(res.data);
};

export const deleteTask = async (id: string, token: string) => {
  await axiosInstance.delete(`/task/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
