import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import type { Task } from "../reducer/taskReducer";
import { fetchCurrentTask } from "../api/taskApi";

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

  if (!user) {
    return (
      <div>
        <p>Please login to view the task</p>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  if (!task) {
    return (
      <div>
        <p>Task not found</p>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }
  return (
    <div>
      {task && (
        <>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>
            Status: {task.isCompleted ? "Completed ✅" : "Not completed ❌"}
          </p>

          <Link to="/">back to home page</Link>
        </>
      )}
    </div>
  );
};

export default TaskDetail;
