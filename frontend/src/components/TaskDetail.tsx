import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import type { Task } from "../reducer/taskReducer";
import { fetchCurrentTask, updateTask, deleteTask } from "../api/taskApi";
import RenderMessage from "./RenderMessage";
import { useTaskContext } from "../hooks/useTaskContext";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

    const comfirm = window.confirm("Delete this task?");
    if (!comfirm) return;

    try {
      await deleteTask(id, user.token);
      dispatch({ type: "REMOVE_TASK", payload: id });
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
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>{!isEdit ? task.title : "Edit Task"}</CardTitle>
        {!isEdit && (
          <CardDescription>
            Status:{" "}
            <span
              className={task.isCompleted ? "text-green-600" : "text-red-600"}
            >
              {task.isCompleted ? "Completed ✅" : "Not completed ❌"}
            </span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEdit ? (
          <>
            <p className="text-gray-700">{task.description}</p>
            <div className="flex gap-2">
              <Button onClick={() => setIsEdit(true)}>Edit</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Input
                id="completed"
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
              />
              <Label htmlFor="completed">Completed</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpdate}>Save</Button>
              <Button variant="outline" onClick={() => setIsEdit(false)}>
                Cancel
              </Button>
            </div>
          </>
        )}
        <Link to="/" className="text-blue-600 hover:underline mt-4 block">
          ← Back to home
        </Link>
      </CardContent>
    </Card>
  );
};

export default TaskDetail;
