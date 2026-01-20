import { useState } from "react";
import Enable2FAModal from "@/components/Enable2FAModal";
import { useAuthContext } from "@/hooks/useAuthContext";

const Security = () => {
  const [showEnableModal, setShowEnableModal] = useState(false);
  const { user, dispatch } = useAuthContext();

  const twoFactorEnabled = user?.twoFactorEnabled || false;

  return (
    <div>
      <h1>Security Settings</h1>

      <div>
        <h2>Two-Factor Authentication</h2>

        {!twoFactorEnabled ? (
          <div>
            <p>Two-Factor Authentication is currently disabled</p>
            <button
              onClick={() => setShowEnableModal(true)}
              className="cursor-pointer"
            >
              Enable 2FA
            </button>
          </div>
        ) : (
          <div>
            <p>✅ Two-Factor Authentication is enabled</p>
            <button className="cursor-pointer">Disable 2FA</button>
            <button className="cursor-pointer">Regenerate Backup Codes</button>
          </div>
        )}
      </div>

      {showEnableModal && (
        <Enable2FAModal
          onClose={() => setShowEnableModal(false)}
          onSuccess={() => {
            // Update user state with twoFactorEnabled: true
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
    </div>
  );
};

export default Security;
