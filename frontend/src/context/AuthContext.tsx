import {
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import { authReducer, initialState, init } from "../reducer/authReducer";
import type { AuthState, AuthAction } from "../reducer/authReducer";

interface AuthContextType extends AuthState {
  dispatch: Dispatch<AuthAction>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState, init);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
