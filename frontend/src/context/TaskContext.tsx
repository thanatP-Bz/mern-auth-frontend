import {
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
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
// eslint-disable-next-line react-refresh/only-export-components
export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const TaskContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
