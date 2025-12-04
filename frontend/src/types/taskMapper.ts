import type { Task } from "../reducer/taskReducer";
import type { TaskApiResponse } from "./taskApiResponse";

export const TaskMapper = (task: TaskApiResponse): Task => ({
  id: task._id,
  title: task.title,
  description: task.description,
  isCompleted: task.isCompleted,
});
