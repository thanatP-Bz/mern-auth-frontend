import { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { changePasswordApi } from "@/api/auth/changePasswordApi";
import { toast } from "sonner";
import {
  BadgeAlert,
  BadgeCheck,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router";

const ChangePassword = () => {
  const { user } = useAuthContext();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Very Weak", color: "bg-red-500" },
      { strength: 2, label: "Weak", color: "bg-orange-500" },
      { strength: 3, label: "Fair", color: "bg-yellow-500" },
      { strength: 4, label: "Good", color: "bg-blue-500" },
      { strength: 5, label: "Strong", color: "bg-green-500" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      return toast("User not found", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    }

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return toast("All fields are required", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    }

    if (newPassword.length < 8) {
      return toast("New password must be at least 8 characters", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    }

    if (newPassword !== confirmNewPassword) {
      return toast("New passwords do not match", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    }

    if (oldPassword === newPassword) {
      return toast("New password must be different from old password", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    }

    setIsLoading(true);

    try {
      await changePasswordApi(user?.email, oldPassword, newPassword);

      toast("Password changed successfully!", {
        icon: <BadgeCheck className="w-5 h-5 text-green-500" />,
        style: {
          background: "white",
          color: "green",
          border: "1px solid green",
        },
      });

      // Clear form after success
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast(error.response?.data?.message || "Something went wrong", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Change Password
              </h2>
              <p className="text-sm text-gray-500">
                Update your account password
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Old Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showOldPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      passwordStrength.strength <= 2
                        ? "text-orange-600"
                        : passwordStrength.strength <= 3
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Confirmation match indicator */}
              {confirmNewPassword && (
                <p
                  className={`text-xs mt-1 ${
                    newPassword === confirmNewPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {newPassword === confirmNewPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Password requirements:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                  • At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)
                      ? "text-green-600"
                      : ""
                  }
                >
                  • Mix of uppercase and lowercase letters
                </li>
                <li className={/\d/.test(newPassword) ? "text-green-600" : ""}>
                  • At least one number
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                      ? "text-green-600"
                      : ""
                  }
                >
                  • At least one special character
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
