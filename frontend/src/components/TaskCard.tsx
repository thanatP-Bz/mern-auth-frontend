import type { Task } from "../reducer/taskReducer";
import { Link } from "react-router";

interface TaskCardProps {
  tasks: Task[];
}
const TaskCard = ({ tasks }: TaskCardProps) => {
  return (
    <div>
      <h2>Your Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <Link to={`/task/${task.id}`}>
              {task.title} {task.isCompleted ? "(✅)" : "(❌)"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskCard;
