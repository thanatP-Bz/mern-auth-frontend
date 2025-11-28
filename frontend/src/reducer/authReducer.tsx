export interface User {
  id: string;
  email: string;
  token: string;
}

export interface AuthState {
  user: User | null;
}

export type AuthAction = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};
