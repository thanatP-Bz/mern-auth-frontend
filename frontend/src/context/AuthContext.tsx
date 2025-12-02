/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useReducer,
  useEffect,
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
};

const init = (initialState: AuthState) => {
  const storedUser = localStorage.getItem("user");

  return {
    ...initialState,
    user: storedUser ? JSON.parse(storedUser) : null,
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

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
