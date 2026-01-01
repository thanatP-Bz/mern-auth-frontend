export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
}

export type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "SET_CURRENT_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "REMOVE_TASK"; payload: string };

export const taskReducer = (
  state: TaskState,
  action: TaskAction
): TaskState => {
  // Ensure tasks is always an array
  const safeTasks = Array.isArray(state.tasks) ? state.tasks : [];

  switch (action.type) {
    case "ADD_TASK": {
      console.log("➕ Adding task:", action.payload.title);
      return {
        ...state,
        tasks: [...safeTasks, action.payload],
      };
    }

    case "SET_TASKS": {
      // Ensure payload is an array
      const newTasks = Array.isArray(action.payload) ? action.payload : [];
      console.log("📋 Setting tasks:", newTasks.length, "tasks");
      return {
        ...state,
        tasks: newTasks,
      };
    }

    case "SET_CURRENT_TASK": {
      console.log("👁️ Setting current task:", action.payload.title);
      return {
        ...state,
        currentTask: action.payload,
      };
    }

    case "UPDATE_TASK": {
      console.log("✏️ Updating task:", action.payload.title);
      return {
        ...state,
        tasks: safeTasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        // Update currentTask if it's the one being updated
        currentTask:
          state.currentTask?.id === action.payload.id
            ? action.payload
            : state.currentTask,
      };
    }

    case "REMOVE_TASK": {
      console.log("🗑️ Removing task:", action.payload);
      return {
        ...state,
        tasks: safeTasks.filter((task) => task.id !== action.payload),
        // Clear currentTask if it's the one being removed
        currentTask:
          state.currentTask?.id === action.payload ? null : state.currentTask,
      };
    }

    default:
      return state;
  }
};
