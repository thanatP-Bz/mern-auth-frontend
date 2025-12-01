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

const init = (initialState: TaskState) => {
  const storedTask = localStorage.getItem("tasks");

  return {
    ...initialState,
    tasks: storedTask ? JSON.parse(storedTask) : [],
  };
};
// eslint-disable-next-line react-refresh/only-export-components
export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const TaskContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(taskReducer, initialState, init);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
