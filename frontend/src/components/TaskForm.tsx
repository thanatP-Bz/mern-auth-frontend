import { useState } from "react";
import { createTask } from "../api/taskApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTaskContext } from "../hooks/useTaskContext";
import type { Task } from "../reducer/taskReducer";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const { user } = useAuthContext();
  const { dispatch } = useTaskContext();

  const submitHandle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return console.log("no auth");

    try {
      const taskFromApi = await createTask(user.token, {
        title,
        description,
        isCompleted,
      });
      const task: Task = {
        id: taskFromApi._id,
        title: taskFromApi.title,
        description: taskFromApi.description,
        isCompleted: taskFromApi.isCompleted,
      };

      dispatch({ type: "ADD_TASK", payload: task });
      setTitle("");
      setDescription("");
      setIsCompleted(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={submitHandle}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="title"
      />

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="discription"
      />

      <label>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
        Completed
      </label>

      <button type="submit">add task</button>
    </form>
  );
};

export default TaskForm;
