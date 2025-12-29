export interface User {
  _id: string;
  email: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
}

export type AuthAction =
  | {
      type: "REGISTER";
      payload: { user: User; accessToken: string; refreshToken: string };
    }
  | {
      type: "LOGIN";
      payload: { user: User; accessToken: string; refreshToken: string };
    }
  | { type: "LOGOUT" };

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "REGISTER":
      localStorage.setItem("accessToken", action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
    case "LOGIN":
      //store both token in localstorage
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
    case "LOGOUT":
      //clear everything
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return { user: null, accessToken: null };
    default:
      return state;
  }
};
