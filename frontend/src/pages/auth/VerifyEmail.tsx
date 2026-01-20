import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "@/api/authentication/email/verifyEmail";
import { Button } from "@/components/ui/button";
import { BadgeCheck, BadgeAlert, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !token ? "error" : "loading",
  );
  const [message, setMessage] = useState(
    !token ? "invalid verification link" : "",
  );

  // ✅ Add a ref to track if verification already ran
  /*   const hasVerified = useRef(false);

  console.log("📱 Token from URL:", token); */

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        console.log("🚀 Calling verifyEmail API...");
        const response = await verifyEmail(token);
        console.log("✅ Verification successful:", response);

        setStatus("success");
        setMessage(response.message || "email verified successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 5000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed");
      }
    };
    verify();
  }, [token, navigate]); // ← Fixed: removed searchParams from deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
        <div className="text-center space-y-4">
          {/* Loading State */}
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-indigo-600 mx-auto animate-spin" />
              <h2 className="text-2xl font-semibold">Verifying Email...</h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <BadgeCheck className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-semibold text-green-700">
                Email Verified! ✅
              </h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Go to Login Now
              </Button>
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <BadgeAlert className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-semibold text-red-700">
                Verification Failed ❌
              </h2>
              <p className="text-gray-600">{message}</p>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => navigate("/register")}
                  variant="outline"
                  className="w-full"
                >
                  Register Again
                </Button>
                <Link
                  to="/login"
                  className="block text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                >
                  Already verified? Go to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
