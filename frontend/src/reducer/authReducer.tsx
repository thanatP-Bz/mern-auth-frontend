export interface User {
  _id: string;
  email: string;
  name: string;
  twoFactorEnabled: boolean;
  hasPassword: boolean;
  authProvider?: string;

  // ❌ Removed token - we store accessToken and refreshToken separately
}

export interface AuthState {
  user: User | null;
  pendingUserId?: string | null;
}

export type AuthAction =
  | {
      type: "REGISTER";
      payload: { user: User };
    }
  | {
      type: "LOGIN";
      payload: { user: User };
    }
  | { type: "REQUIRE_2FA"; payload: { userId: string; message: string } }
  | { type: "UPDATE_USER"; payload: { user: User } }
  | { type: "LOGOUT" };

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case "REGISTER": {
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      return {
        user: action.payload.user,
      };
    }

    case "LOGIN": {
      // ✅ Combined both cases - they do the same thing

      localStorage.setItem("user", JSON.stringify(action.payload.user));

      console.log("✅ User authenticated:", action.payload.user.email);
      console.log("💾 Tokens saved to localStorage");

      return {
        user: action.payload.user,
      };
    }

    case "REQUIRE_2FA": {
      return {
        ...state,
        user: null,
        pendingUserId: action.payload.userId,
      };
    }

    case "UPDATE_USER": {
      const updatedUser = action.payload.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return {
        ...state,
        user: updatedUser,
      };
    }

    case "LOGOUT": {
      // ✅ Clear everything including old 'token' if it exists

      localStorage.removeItem("user");

      console.log("👋 User logged out");
      console.log("🗑️ Cleared all tokens from localStorage");

      return {
        user: null,
      };
    }

    default:
      return state;
  }
};

// ✅ Export initial state
export const initialState: AuthState = {
  user: null,
};

// ✅ Export init function to load from localStorage on app start
export const init = (initialState: AuthState): AuthState => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.log("📦 No user in localStorage");
      return initialState;
    }

    const user = JSON.parse(storedUser);
    console.log("✅ Loaded user from localStorage:", user.email);

    if (!user || !user.email || !user._id) {
      console.log("⚠️ Invalid user data in localStorage, clearing...");
      localStorage.clear();
      return initialState;
    }

    console.log("✅ Loaded user from localStorage:", user.email);

    return {
      user,
    };
  } catch (error) {
    console.error("❌ Failed to parse user from localStorage:", error);
    localStorage.clear();
    return initialState;
  }
};
