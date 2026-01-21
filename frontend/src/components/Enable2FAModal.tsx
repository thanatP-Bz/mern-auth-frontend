import { useEffect, useState } from "react";
import { enable2FAApi } from "@/api/authentication/2FA/enabled2FAApi";
import { toast } from "sonner";
import { BadgeAlert, BadgeCheck, X, Copy, CheckCircle2 } from "lucide-react";
import { verify2FASetupApi } from "@/api/authentication/2FA/verify2FASetUp";

interface enabled2FAProps {
  onClose: () => void;
  onSuccess: () => void;
}

const Enable2FAModal = ({ onClose, onSuccess }: enabled2FAProps) => {
  const [step, setStep] = useState<"loading" | "qr" | "verify" | "backup">(
    "loading",
  );
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setupBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    const fetchQRcode = async () => {
      try {
        const response = await enable2FAApi();
        setQrCode(response.qrCode);
        setSecret(response.secret);
        setupBackupCodes(response.backupCodes);
        setStep("qr");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast(error.response?.data?.message || "something went wrong", {
          icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        });
      }
    };

    fetchQRcode();
  }, []);

  const handleVerify = async () => {
    try {
      const response = await verify2FASetupApi(verificationCode);
      setupBackupCodes(response.backupCodes);

      toast("2FA Enabled Successfully!", {
        icon: <BadgeCheck className="w-5 h-5 text-green-500" />,
      });

      setStep("backup");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast(error.response?.data?.message || "Invalid code", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        {/* Modal */}
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Enable Two-Factor Authentication
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Loading Step */}
            {step === "loading" && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating QR code...</p>
              </div>
            )}

            {/* QR Code Step */}
            {step === "qr" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <p className="font-medium text-gray-900">
                      Scan QR code with your authenticator app
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    Can't scan? Enter this code manually:
                  </p>
                  <code className="block bg-white px-3 py-2 rounded border border-blue-200 text-center font-mono text-sm break-all">
                    {secret}
                  </code>
                </div>

                <button
                  onClick={() => setStep("verify")}
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Next: Verify Code
                </button>
              </div>
            )}

            {/* Verify Step */}
            {step === "verify" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <p className="font-medium text-gray-900">
                      Enter the 6-digit code to verify
                    </p>
                  </div>

                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    maxLength={6}
                    className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleVerify}
                  disabled={verificationCode.length !== 6}
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Verify & Enable 2FA
                </button>
              </div>
            )}

            {/* Backup Codes Step */}
            {step === "backup" && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    2FA Enabled Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Save these backup codes in a safe place. You can use them to
                    access your account if you lose your phone.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-medium mb-3">
                    ⚠️ Important: Store these codes securely
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <code
                        key={index}
                        className="bg-white px-3 py-2 rounded border border-yellow-300 text-center font-mono text-sm"
                      >
                        {code}
                      </code>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(backupCodes.join("\n"));
                      toast("Backup codes copied to clipboard!", {
                        icon: <Copy className="w-5 h-5" />,
                      });
                    }}
                    className="cursor-pointer flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </button>
                  <button
                    onClick={() => {
                      onSuccess();
                      onClose();
                    }}
                    className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Enable2FAModal;
