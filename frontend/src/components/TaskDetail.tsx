import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import type { Task } from "../reducer/taskReducer";
import { fetchCurrentTask, updateTask } from "../api/taskApi";
import RenderMessage from "./RenderMessage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, BadgeCheck, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
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
      toast("Edit Task Completed!", {
        icon: <BadgeCheck className="w-5 h-5 text-green" />,
        style: {
          background: "white",
          color: "green",
          border: "green 1px solid",
        },
      });
    } catch {
      toast("Failed To Edit Task", {
        icon: <AlertCircle className="w-5 h-5 text-green" />,
        style: {
          background: "white",
          color: "green",
          border: "green 1px solid",
        },
      });
    }
  };

  if (!user) return <RenderMessage message="Please login" />;
  if (loading) return <RenderMessage message="Loading..." />;
  if (error) return <RenderMessage message={error} />;
  if (!task) return <RenderMessage message="Task not found" />;

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{!isEdit ? task.title : "Edit Task"}</CardTitle>
        </div>

        {!isEdit && (
          <div className="flex items-center gap-1 text-sm">
            {task.isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Pending</span>
              </>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {!isEdit ? (
          <>
            <p className="text-gray-700">{task.description}</p>
            <div className="flex gap-2">
              <Button onClick={() => setIsEdit(true)}>Edit</Button>
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
              <Button className="cursor-pointer" onClick={handleUpdate}>
                Save
              </Button>
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setIsEdit(false)}
              >
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
