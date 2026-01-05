import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "@/api/auth/verifyEmail";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !token ? "error" : "loading"
  );
  const [message, setMessage] = useState(
    !token ? "invalid verification link" : ""
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "email verified successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data.message || "Verification failed");
      }
    };
    verify();
  }, [searchParams, navigate, token]);

  return (
    <div>
      <h2>verify email</h2>

      {status === "success" && (
        <div>
          <h2>email verify</h2>
          <p>{message}</p>
          <p>redirecting to login...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <h2>verification fail</h2>
          <p>{message}</p>
          <button onClick={() => navigate("/login")}>go to login</button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
