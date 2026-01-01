export interface User {
  _id: string;
  email: string;
  // ❌ Removed token - we store accessToken and refreshToken separately
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
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

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "REGISTER":
    case "LOGIN": {
      // ✅ Combined both cases - they do the same thing
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      console.log("✅ User authenticated:", action.payload.user.email);
      console.log("💾 Tokens saved to localStorage");

      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    }

    case "LOGOUT": {
      // ✅ Clear everything including old 'token' if it exists
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Remove old one too

      console.log("👋 User logged out");
      console.log("🗑️ Cleared all tokens from localStorage");

      return {
        user: null,
        accessToken: null,
        refreshToken: null,
      };
    }

    default:
      return state;
  }
};

// ✅ Export initial state
export const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

// ✅ Export init function to load from localStorage on app start
export const init = (initialState: AuthState): AuthState => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (!storedUser) {
      console.log("📦 No user in localStorage");
      return initialState;
    }

    const user = JSON.parse(storedUser);
    console.log("✅ Loaded user from localStorage:", user.email);

    return {
      user,
      accessToken: storedAccessToken,
      refreshToken: storedRefreshToken,
    };
  } catch (error) {
    console.error("❌ Failed to parse user from localStorage:", error);
    localStorage.clear();
    return initialState;
  }
};
