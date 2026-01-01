import {
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
  useEffect,
} from "react";
import {
  type TaskAction,
  type TaskState,
  taskReducer,
} from "../reducer/taskReducer";

interface TaskContextType extends TaskState {
  dispatch: Dispatch<TaskAction>;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
};

const init = (initialState: TaskState): TaskState => {
  try {
    const storedTasks = localStorage.getItem("tasks");

    if (!storedTasks) {
      return { ...initialState, tasks: [] };
    }

    const parsed = JSON.parse(storedTasks);

    if (!Array.isArray(parsed)) {
      localStorage.removeItem("tasks");
      return { ...initialState, tasks: [] };
    }

    return { ...initialState, tasks: parsed };
  } catch (error) {
    console.error("❌ Failed to parse tasks from localStorage:", error);
    localStorage.removeItem("tasks");
    return { ...initialState, tasks: [] };
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

interface TaskContextProviderProps {
  children: ReactNode;
}

export const TaskContextProvider = ({ children }: TaskContextProviderProps) => {
  const [state, dispatch] = useReducer(taskReducer, initialState, init);

  useEffect(() => {
    // Only save valid arrays to localStorage
    if (Array.isArray(state.tasks)) {
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    } else {
      console.error(
        "❌ Attempted to save invalid tasks (not an array):",
        state.tasks
      );
    }
  }, [state.tasks]);

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
