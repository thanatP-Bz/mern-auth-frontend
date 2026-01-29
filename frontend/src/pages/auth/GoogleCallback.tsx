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
    const exchangeToken = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        toast.error("Google login failed. Please try again.");
        navigate("/login");
        return;
      }

      if (token) {
        try {
          // ✅ Exchange temp token for httpOnly cookies
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/oauth/exchange-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include", // ✅ Critical for cookies
              body: JSON.stringify({ token }),
            },
          );

          if (!response.ok) throw new Error("Token exchange failed");

          const data = await response.json();

          dispatch({
            type: "LOGIN",
            payload: { user: data.user },
          });

          toast.success("Logged in with Google successfully!");
          navigate("/home", { replace: true });
        } catch (error) {
          console.log(error);
          toast.error("Authentication failed");
          navigate("/login");
        }
      } else {
        toast.error("Invalid OAuth response");
        navigate("/login");
      }
    };

    exchangeToken();
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
