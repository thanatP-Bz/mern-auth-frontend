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
  user: null,
  accessToken: null,
};

const init = (initialState: AuthState) => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("accessToken");

  return {
    ...initialState,
    user: storedUser ? JSON.parse(storedUser) : null,
    access: storedToken,
  };
};

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
