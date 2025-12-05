import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import type { Task } from "../reducer/taskReducer";
import { fetchCurrentTask } from "../api/taskApi";
import { updateTask } from "../api/taskApi";
import RenderMessage from "./RenderMessage";

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !id) return;

    const loadTask = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchCurrentTask(id, user.token);
        setTask(data);
      } catch {
        setError("Failed to load task");
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id, user]);

  const handleUpdate = async () => {
    if (!user || !id) return;

    try {
      if (!task) return null;
      const editTask = await updateTask(id, user.token, {
        title: task.title,
        description: task.description,
        isCompleted: task.isCompleted,
      });

      setTask(editTask);
    } catch {
      setError("Failed to update task");
    }
  };

  if (!user) return <RenderMessage message="Please login to view the task" />;
  if (loading) return <RenderMessage message="Loading..." />;
  if (error) return <RenderMessage message={error} />;
  if (!task) return <RenderMessage message="Task not found" />;

  return (
    <div>
      <button type="submit" onSubmit={handleUpdate}>
        edit
      </button>
      <button type="button">delete</button>

      {task && (
        <>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>
            Status: {task.isCompleted ? "Completed ✅" : "Not completed ❌"}
          </p>
        </>
      )}
      <Link to="/">back to home page</Link>
    </div>
  );
};

export default TaskDetail;
