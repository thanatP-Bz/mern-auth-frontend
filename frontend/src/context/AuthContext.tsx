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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  console.log("Auth Context state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
