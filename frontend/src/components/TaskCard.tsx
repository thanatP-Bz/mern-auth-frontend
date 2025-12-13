import type { Task } from "../reducer/taskReducer";
import { Link } from "react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  tasks: Task[];
}
const TaskCard = ({ tasks }: TaskCardProps) => {
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
