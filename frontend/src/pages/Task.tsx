import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import { useTaskContext } from "@/hooks/useTaskContext";

const Task = () => {
  const { tasks } = useTaskContext();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Task List Section */}
          <div className="order-2 lg:order-1">
            <TaskCard tasks={tasks} />
          </div>

          {/* Task Form Section */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <TaskForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
