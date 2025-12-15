import type { Task } from "../reducer/taskReducer";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useTaskContext } from "@/hooks/useTaskContext";
import { deleteTask } from "@/api/taskApi";
import { useState } from "react";
import RenderMessage from "./RenderMessage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";

interface TaskCardProps {
  tasks: Task[];
}
const TaskCard = ({ tasks }: TaskCardProps) => {
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthContext();
  const { dispatch } = useTaskContext();
  const navigate = useNavigate();

  const deleteHadle = async (taskId: string) => {
    if (!user) return;

    console.log(user, taskId);

    const comfirm = window.confirm("Delete this task?");
    if (!comfirm) return;

    try {
      await deleteTask(taskId, user.token);
      dispatch({ type: "REMOVE_TASK", payload: taskId });
      navigate("/", { replace: true });
    } catch {
      setError("Failed to delete task");
    }
  };

  if (error) return <RenderMessage message={error} />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Tasks</h2>

      {tasks.length === 0 && (
        <p className="text-muted-foreground">No tasks yet.</p>
      )}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="hover:shadow-md transition-shadow border-none"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                <Link to={`/task/${task.id}`} className="hover:underline">
                  {task.title}
                </Link>
              </CardTitle>

              <Badge>{task.isCompleted ? "Completed" : "Pending"}</Badge>
            </CardHeader>

            {task.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </CardContent>
            )}
            <Button
              onClick={() => deleteHadle(task.id)}
              className="m-2 cursor-pointer"
            >
              delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
