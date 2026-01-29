// frontend/src/pages/auth/GoogleCallback.tsx

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { toast } from "sonner";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const sessionId = searchParams.get("sessionId");
    const userData = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google login failed. Please try again.");
      navigate("/login");
      return;
    }

    if (accessToken && refreshToken && userData) {
      // ✅ Set cookies with SameSite=None for cross-origin
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; sameSite=none`;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure; sameSite=none`;

      if (sessionId) {
        document.cookie = `sessionId=${sessionId}; path=/; max-age=${60 * 60 * 24 * 7}; secure; sameSite=none`;
      }

      // Parse and store user data
      const user = JSON.parse(decodeURIComponent(userData));

      dispatch({
        type: "LOGIN",
        payload: { user },
      });

      toast.success("Logged in with Google successfully!");
      navigate("/home", { replace: true });
    } else {
      toast.error("Invalid OAuth response");
      navigate("/login");
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
