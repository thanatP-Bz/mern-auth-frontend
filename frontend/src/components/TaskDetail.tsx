import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import type { Task } from "../reducer/taskReducer";
import { fetchCurrentTask, updateTask } from "../api/task/taskApi";
import RenderMessage from "./RenderMessage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  BadgeCheck,
  Check,
  Clock,
  ArrowLeft,
  Edit,
  Save,
  X,
} from "lucide-react";
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
        const data = await fetchCurrentTask(id);
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
      const updated = await updateTask(id, {
        title,
        description,
        isCompleted,
      });

      setTask(updated);
      setIsEdit(false);
      toast("Task updated successfully!", {
        icon: <BadgeCheck className="w-5 h-5 text-green-600" />,
        style: {
          background: "white",
          color: "#16a34a",
          border: "1px solid #16a34a",
        },
      });
    } catch {
      toast("Failed to update task", {
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        style: {
          background: "white",
          color: "#dc2626",
          border: "1px solid #dc2626",
        },
      });
    }
  };

  const handleCancel = () => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description);
    setIsCompleted(task.isCompleted);
    setIsEdit(false);
  };

  if (!user) return <RenderMessage message="Please login" />;
  if (loading) return <RenderMessage message="Loading..." />;
  if (error) return <RenderMessage message={error} />;
  if (!task) return <RenderMessage message="Task not found" />;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to tasks</span>
        </Link>

        <Card className="shadow-sm bg-white">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {!isEdit ? "Task Details" : "Edit Task"}
                </CardTitle>
                {!isEdit && (
                  <p className="text-sm text-gray-500">
                    View and manage your task
                  </p>
                )}
              </div>

              {!isEdit && (
                <Badge
                  variant={task.isCompleted ? "default" : "secondary"}
                  className="flex items-center gap-1.5 shrink-0"
                >
                  {task.isCompleted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Completed</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Pending</span>
                    </>
                  )}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {!isEdit ? (
              <div className="space-y-6">
                {/* View Mode */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">
                      Title
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">
                      Description
                    </Label>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {task.description || (
                        <span className="text-gray-400 italic">
                          No description provided
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">
                      Status
                    </Label>
                    <div className="flex items-center gap-2">
                      {task.isCompleted ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">Task completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">Task pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => setIsEdit(true)}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Task
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Edit Mode */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    className="bg-gray-50 border-gray-200 focus:bg-white resize-none min-h-[120px]"
                    rows={5}
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <Checkbox
                    id="completed"
                    checked={isCompleted}
                    onCheckedChange={(checked) =>
                      setIsCompleted(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor="completed"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Mark as completed
                  </Label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button onClick={handleUpdate} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetail;
