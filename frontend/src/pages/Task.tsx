import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import { useTaskContext } from "@/hooks/useTaskContext";

const Task = () => {
  const { tasks } = useTaskContext();

  return (
    <div className="min-h-screen item-center bg-slate-50">
      <div className="max-w-2xl flex items-center justify-center gap-10 mx-auto p-6 space-y-8 ">
        <TaskCard tasks={tasks} />
        <TaskForm />
      </div>
    </div>
  );
};

export default Task;
