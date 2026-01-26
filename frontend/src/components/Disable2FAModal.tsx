import { useState } from "react";
import { disable2FAApi } from "@/api/authentication/2FA/disable2FAApi";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  BadgeAlert,
  BadgeCheck,
  X,
  ShieldOff,
  AlertTriangle,
} from "lucide-react";

interface Disable2FAProps {
  onClose: () => void;
  onSuccess: () => void;
}

const Disable2FAModal = ({ onClose, onSuccess }: Disable2FAProps) => {
  const { user } = useAuthContext(); // ✅ Get user from context
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // ✅ Check if user is OAuth user (no password needed)
  const isOAuthUser = user?.authProvider === "google";

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ OAuth users don't need to send password
      await disable2FAApi(isOAuthUser ? "" : password);

      toast("2FA Disabled Successfully!", {
        icon: <BadgeCheck className="w-5 h-5 text-green-500" />,
      });

      onSuccess();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast(error.response?.data?.message || "Failed to disable 2FA", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        {/* Modal */}
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ShieldOff className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Disable Two-Factor Authentication
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleDisable} className="p-6 space-y-6">
            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">
                  Warning: This will reduce your account security
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  {/* ✅ Dynamic text based on auth provider */}
                  Your account will only be protected by your{" "}
                  {isOAuthUser ? "Google account" : "password"}.
                </p>
              </div>
            </div>

            {/* Password Input - Only show for non-OAuth users */}
            {!isOAuthUser && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm your password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {/* OAuth User Info - Only show for OAuth users */}
            {isOAuthUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Google Account:</strong> {user?.email}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  No password required - you're signed in with Google
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="cursor-pointer flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!isOAuthUser && !password)}
                className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                {loading ? "Disabling..." : "Disable 2FA"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Disable2FAModal;
