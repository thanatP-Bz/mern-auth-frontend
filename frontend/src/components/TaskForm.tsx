import { useState } from "react";
import { createTask } from "../api/taskApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { useTaskContext } from "../hooks/useTaskContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      const task = await createTask(user.token, {
        title,
        description,
        isCompleted,
      });

      dispatch({ type: "ADD_TASK", payload: task });
      setTitle("");
      setDescription("");
      setIsCompleted(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="mb-6 border-none">
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={submitHandle} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="border-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="border-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="completed"
              checked={isCompleted}
              onCheckedChange={(checked) => setIsCompleted(Boolean(checked))}
            />
            <Label htmlFor="completed">Completed</Label>
          </div>

          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
