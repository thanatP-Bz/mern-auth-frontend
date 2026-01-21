import { useState } from "react";
import { regenerateBackupCodesApi } from "@/api/authentication/2FA/regenrateBackupCodesApi";
import { toast } from "sonner";
import { BadgeAlert, X, Copy, RefreshCw, AlertTriangle } from "lucide-react";

interface RegenerateBackupCodesModalProps {
  onClose: () => void;
}

const RegenerateBackupCodesModal = ({
  onClose,
}: RegenerateBackupCodesModalProps) => {
  const [step, setStep] = useState<"confirm" | "codes">("confirm");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const response = await regenerateBackupCodesApi();
      setBackupCodes(response.backupCodes);
      setStep("codes");

      toast("Backup codes regenerated successfully!", {
        icon: <RefreshCw className="w-5 h-5 text-green-500" />,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast(error.response?.data?.message || "Failed to regenerate codes", {
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
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Regenerate Backup Codes
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
          <div className="p-6">
            {step === "confirm" && (
              <div className="space-y-6">
                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      Warning: This will invalidate your old backup codes
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Any previously saved backup codes will no longer work.
                      Make sure to save your new codes.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="cursor-pointer flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    {loading ? "Generating..." : "Generate New Codes"}
                  </button>
                </div>
              </div>
            )}

            {step === "codes" && (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Save these backup codes in a safe place. You can use them to
                  access your account if you lose your phone.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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
                      toast("Backup codes copied!", {
                        icon: <Copy className="w-5 h-5" />,
                      });
                    }}
                    className="cursor-pointer flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy All
                  </button>
                  <button
                    onClick={onClose}
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

export default RegenerateBackupCodesModal;
