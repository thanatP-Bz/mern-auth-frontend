import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import type { Task } from "../reducer/taskReducer";
import { fetchCurrentTask, updateTask, deleteTask } from "../api/taskApi";
import RenderMessage from "./RenderMessage";
import { useTaskContext } from "../hooks/useTaskContext";

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const { dispatch } = useTaskContext();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!user || !id) return;

    const loadTask = async () => {
      try {
        setLoading(true);

        const data = await fetchCurrentTask(id, user.token);
        setTask(data);

        // ✅ populate edit form
        setTitle(data.title);
        setDescription(data.description);
        setIsCompleted(data.isCompleted);
      } catch {
        setError("Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, user]);

  useEffect(() => {
    if (!loading && task === null) {
      navigate("/", { replace: true });
    }
  }, [task, loading, navigate]);

  const handleUpdate = async () => {
    if (!user || !id || !task) return;

    try {
      const updated = await updateTask(id, user.token, {
        title,
        description,
        isCompleted,
      });

      setTask(updated);
      setIsEdit(false);
    } catch {
      setError("Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (!user || !id) return;

    try {
      await deleteTask(id, user.token);

      setTask(null);
      dispatch({ type: "REMOVE_TASK", payload: id });
      console.log(task);
      navigate("/", { replace: true });
    } catch {
      setError("Failed to delete task");
    }
  };

  if (!user) return <RenderMessage message="Please login" />;
  if (loading) return <RenderMessage message="Loading..." />;
  if (error) return <RenderMessage message={error} />;
  if (!task) return <RenderMessage message="Task not found" />;

  return (
    <div>
      {!isEdit ? (
        <>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>
            Status: {task.isCompleted ? "Completed ✅" : "Not completed ❌"}
          </p>

          <button type="button" onClick={() => setIsEdit(true)}>
            Edit
          </button>
          <button type="button" onClick={handleDelete}>
            delete
          </button>
        </>
      ) : (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="descriptiom"
          />

          <label>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
            Completed
          </label>

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEdit(false)}>Cancel</button>
        </>
      )}

      <Link to="/">Back to home</Link>
    </div>
  );
};

export default TaskDetail;
