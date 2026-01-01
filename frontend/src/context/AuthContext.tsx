/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import {
  type AuthAction,
  type AuthState,
  authReducer,
} from "../reducer/authReducer";

interface AuthContextType extends AuthState {
  dispatch: Dispatch<AuthAction>;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
