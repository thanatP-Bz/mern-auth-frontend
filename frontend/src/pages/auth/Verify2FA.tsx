import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { verify2FALoginApi } from "@/api/authentication/2FA/verify2faLoginApi";

export const Verify2FA = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { dispatch, pendingUserId } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Make sure we have a pending userId
      if (!pendingUserId) {
        setError("No pending login session. Please login again.");
        navigate("/login");
        return;
      }

      // Call the verify API
      const response = await verify2FALoginApi(pendingUserId, code);

      // Success! Dispatch LOGIN action
      dispatch({
        type: "LOGIN",
        payload: {
          user: response.user,
        },
      });

      // Navigate to home
      navigate("/home", { replace: true });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid 2FA code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Two-Factor Authentication</h1>
      <p>Enter the 6-digit code from your authenticator app</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="code">Authentication Code</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
            required
            disabled={loading}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="cursor-pointer"
          type="submit"
          disabled={loading || code.length !== 6}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};
