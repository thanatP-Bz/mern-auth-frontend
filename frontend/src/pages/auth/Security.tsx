import { useState } from "react";
import Enable2FAModal from "@/components/Enable2FAModal";
import Disable2FAModal from "@/components/Disable2FAModal";
import RegenerateBackupCodesModal from "@/components/RegenerateBackupCodesModal";
import { useAuthContext } from "@/hooks/useAuthContext";
import { ArrowLeft, Shield, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Security = () => {
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const { user, dispatch } = useAuthContext();

  const twoFactorEnabled = user?.twoFactorEnabled || false;
  const hasPassword = user?.hasPassword ?? true; // ✅ Add this
  console.log(hasPassword);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Security Settings
        </h1>

        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* 2FA Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            {twoFactorEnabled ? (
              <ShieldCheck className="w-6 h-6 text-green-600" />
            ) : (
              <Shield className="w-6 h-6 text-gray-400" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              Two-Factor Authentication
            </h2>
          </div>

          {/* ✅ Show message for Google OAuth users */}
          {!hasPassword ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700">
                You signed in with <span className="font-semibold">Google</span>
                .
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Two-Factor Authentication is not available for accounts using
                Google sign-in, as your account is already secured through
                Google.
              </p>
            </div>
          ) : !twoFactorEnabled ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Add an extra layer of security to your account. You'll need to
                enter a code from your authenticator app when you sign in.
              </p>
              <button
                onClick={() => setShowEnableModal(true)}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Enable 2FA
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-medium">
                  Two-Factor Authentication is active
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDisableModal(true)}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Disable 2FA
                </button>
                <button
                  onClick={() => setShowRegenerateModal(true)}
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Regenerate Backup Codes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showEnableModal && (
        <Enable2FAModal
          onClose={() => setShowEnableModal(false)}
          onSuccess={() => {
            if (user) {
              dispatch({
                type: "UPDATE_USER",
                payload: {
                  user: {
                    ...user,
                    twoFactorEnabled: true,
                  },
                },
              });
            }
            setShowEnableModal(false);
          }}
        />
      )}

      {showDisableModal && (
        <Disable2FAModal
          onClose={() => setShowDisableModal(false)}
          onSuccess={() => {
            if (user) {
              dispatch({
                type: "UPDATE_USER",
                payload: {
                  user: {
                    ...user,
                    twoFactorEnabled: false,
                  },
                },
              });
            }
            setShowDisableModal(false);
          }}
        />
      )}

      {/* regenrate backup codes */}
      {showRegenerateModal && (
        <RegenerateBackupCodesModal
          onClose={() => setShowRegenerateModal(false)}
        />
      )}
    </div>
  );
};

export default Security;
