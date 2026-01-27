import { useState } from "react";
import { createTask } from "../api/task/taskApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTaskContext } from "../hooks/useTaskContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BadgeAlert, BadgeCheck, Plus } from "lucide-react";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const { user } = useAuthContext();
  const { dispatch } = useTaskContext();

  const submitHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const task = await createTask({
        title,
        description,
        isCompleted,
      });

      toast("Task Created!", {
        icon: <BadgeCheck className="w-5 h-5 text-green-600" />,
        style: {
          background: "white",
          color: "#16a34a",
          border: "1px solid #16a34a",
        },
      });

      dispatch({ type: "ADD_TASK", payload: task });
      setTitle("");
      setDescription("");
      setIsCompleted(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast(error.response?.data?.message || "Something went wrong", {
        icon: <BadgeAlert className="w-5 h-5 text-red-600" />,
        style: {
          background: "white",
          color: "#dc2626",
          border: "1px solid #dc2626",
        },
      });
    }
  };

  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-xl">Create Task</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={submitHandle} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title:
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="bg-gray-50 border-gray-200 focus:bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description:
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="bg-gray-50 border-gray-200 focus:bg-white resize-none"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <Checkbox
              id="completed"
              checked={isCompleted}
              onCheckedChange={(checked) => setIsCompleted(Boolean(checked))}
            />
            <Label
              htmlFor="completed"
              className="text-sm font-medium cursor-pointer"
            >
              Mark as completed
            </Label>
          </div>

          <Button type="submit" className="w-full cursor-pointer" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
