export interface Task {
  id: string;
  title: string;
  discription: string;
  completed: boolean;
}

export interface TaskState {
  tasks: Task[];
}

export type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "SET_CURRENT_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "REMOVE_TASK"; payload: string };

export const taskReducer = (state: TaskState, action: TaskAction) => {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, task: action.payload };

    case "SET_TASKS":
      return { ...state, task: action.payload };

    case "SET_CURRENT_TASK":
      return { ...state, task: action.payload };

    case "UPDATE_TASK":
      return {
        ...state,
        task: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case "REMOVE_TASK":
      return {
        ...state,
        task: state.tasks.filter((task) => task.id !== action.payload),
      };
  }
};
