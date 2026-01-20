import { useEffect, useState } from "react";
import { enable2FAApi } from "@/api/authentication/2FA/enabled2FAApi";
import { toast } from "sonner";
import { BadgeAlert, BadgeCheck } from "lucide-react";
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
        toast(error.response?.data?.message || "somthing went wrong", {
          icon: <BadgeAlert className="w-5 h-5 text-red" />,
          style: {
            background: "white",
            color: "red",
            border: "red 1px solid",
          },
        });
      }
    };

    fetchQRcode();
  }, []);

  const handleVerify = async () => {
    try {
      const response = await verify2FASetupApi(verificationCode);

      // Success! Show backup codes
      setupBackupCodes(response.backupCodes);

      toast("2FA Enabled Successfully!", {
        icon: <BadgeCheck className="w-5 h-5 text-green" />,
        style: {
          background: "white",
          color: "green",
          border: "green 1px solid",
        },
      });

      // Move to showing backup codes
      setStep("backup");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast(error.response?.data?.message || "Invalid code", {
        icon: <BadgeAlert className="w-5 h-5 text-red" />,
        style: {
          background: "white",
          color: "red",
          border: "red 1px solid",
        },
      });
    }
  };

  return (
    <div>
      <h2>Enable Two-Factor Authentication</h2>

      {step === "loading" && <p>Generating QR code...</p>}

      {step === "qr" && (
        <div>
          <p>Step 1: Scan this QR code with your authenticator app</p>

          {/* Display QR code */}
          <img src={qrCode} alt="QR Code" />

          <p>Or enter this code manually:</p>
          <code>{secret}</code>

          <button onClick={() => setStep("verify")} className="cursor-pointer">
            Next: Verify Code
          </button>
        </div>
      )}

      {step === "verify" && (
        <div>
          <p>Step 2: Enter the 6-digit code from your app to verify</p>

          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
          />

          <button
            onClick={
              /* We'll add verify logic next */
              handleVerify
            }
            disabled={verificationCode.length !== 6}
            className="cursor-pointer"
          >
            Verify & Enable 2FA
          </button>
        </div>
      )}

      <button onClick={onClose} className="cursor-pointer">
        Cancel
      </button>

      {step === "backup" && (
        <div>
          <h3>✅ 2FA Enabled Successfully!</h3>

          <p>
            Save these backup codes in a safe place. You can use them to access
            your account if you lose your phone.
          </p>

          <div>
            {backupCodes.map((code, index) => (
              <div key={index}>
                <code>{code}</code>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              // Copy all codes to clipboard
              navigator.clipboard.writeText(backupCodes.join("\n"));
              toast("Backup codes copied to clipboard!", {
                icon: <BadgeCheck className="w-5 h-5 text-green" />,
                style: {
                  background: "white",
                  color: "green",
                  border: "green 1px solid",
                },
              });
            }}
            className="cursor-pointer"
          >
            Copy All Codes
          </button>

          <button
            onClick={() => {
              onClose();
              onSuccess();
            }}
            className="cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default Enable2FAModal;
