import type { Task } from "../reducer/taskReducer";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useTaskContext } from "@/hooks/useTaskContext";
import { deleteTask } from "@/api/task/taskApi";
import { useState } from "react";
import RenderMessage from "./RenderMessage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Check, Clock, Trash2, Eye } from "lucide-react";

interface TaskCardProps {
  tasks: Task[];
}

const TaskCard = ({ tasks }: TaskCardProps) => {
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthContext();
  const { dispatch } = useTaskContext();
  const navigate = useNavigate();

  const deleteHandle = async (taskId: string) => {
    if (!user) return;

    const confirm = window.confirm("Delete this task?");
    if (!confirm) return;

    try {
      await deleteTask(taskId);
      dispatch({ type: "REMOVE_TASK", payload: taskId });
      navigate("/", { replace: true });
    } catch {
      setError("Failed to delete task");
    }
  };

  if (error) return <RenderMessage message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Your Tasks
        </h2>
        <p className="text-sm text-gray-500">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
        </p>
      </div>

      {tasks.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  No tasks yet
                </p>
                <p className="text-sm text-gray-500">
                  Create your first task to get started!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg font-semibold leading-tight flex-1 break-words">
                  {task.title}
                </CardTitle>

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
              </div>
            </CardHeader>

            {task.description && (
              <CardContent className="pt-0 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {task.description}
                </p>
              </CardContent>
            )}

            <CardContent className="pt-0 pb-4 border-t border-gray-100 mt-2">
              <div className="flex gap-2 pt-4">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link
                    to={`/task/${task.id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </Link>
                </Button>
                <Button
                  onClick={() => deleteHandle(task.id)}
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
