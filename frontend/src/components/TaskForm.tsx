import { useState } from "react";
import { createTask } from "../api/taskApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTaskContext } from "../hooks/useTaskContext";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  const { user } = useAuthContext();
  const { dispatch } = useTaskContext();

  const submitHandle = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(user);

    if (!user) return console.log("no auth");

    try {
      const task = await createTask(user.token, {
        title,
        description,
        completed,
      });

      dispatch({ type: "ADD_TASK", payload: task });
      setTitle("");
      setDescription("");
      setCompleted(false);
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
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>

      <button type="submit">add task</button>
    </form>
  );
};

export default TaskForm;
