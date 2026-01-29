import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { toast } from "sonner";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    const userData = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google login failed. Please try again.");
      navigate("/login");
      return;
    }

    if (userData) {
      // ✅ Cookies are already set by backend!
      // Just parse user data and update context
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
