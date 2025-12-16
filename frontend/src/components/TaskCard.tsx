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
import { Check, Clock } from "lucide-react";

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
              <CardTitle className="text-base">title: {task.title}</CardTitle>

              <Badge className="flex items-center gap-1">
                {task.isCompleted ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Completed
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-gray-400" />
                    Pending
                  </>
                )}
              </Badge>
            </CardHeader>

            {task.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  description: {task.description}
                </p>
              </CardContent>
            )}

            <div className="m-4 space-x-4">
              <Button className="cursor-pointer">
                <Link to={`/task/${task.id}`}>details</Link>
              </Button>
              <Button
                onClick={() => deleteHadle(task.id)}
                className=" cursor-pointer"
              >
                delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
