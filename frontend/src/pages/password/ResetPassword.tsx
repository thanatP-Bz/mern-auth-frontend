import { resetPassword } from "@/api/resetPasswordApi";
import { useState } from "react";
import { Link } from "react-router";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();

  console.log("Token from useParams:", token);
  console.log("Token type:", typeof token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Password does not match");
      return false;
    }

    return true;
  };

  const submitHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) return false;

    setIsLoading(true);

    try {
      if (!token) {
        setError("invalid token");
        return;
      }
      await resetPassword(token, newPassword);
      setIsSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.response?.data?.message);

      // Set the error message
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div>
        <div>
          <h2>✅ Success!</h2>
          <p>Your password has been reset.</p>
          <button type="submit">
            <Link to="/auth">go back to log in</Link>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submitHandle}>
      <div>
        <h2>reset password</h2>
        <p>enter your password</p>

        {error && <div>{error}</div>}

        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter New Password"
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            disabled={isLoading}
          />
        </div>
      </div>

      <button type="submit" className="cursor-pointer" disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
