export interface RegiesterSuccessResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    twoFactorEnabled: boolean;
  };
}

export interface Require2FAResponse {
  requires2FA: true;
  message: string;
  userId: string;
}

export interface LoginSuccessResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    twoFactorEnabled: boolean;
  };
}

export type authResponse = Require2FAResponse | LoginSuccessResponse;

export interface Enabled2FAResponse {
  message: string;
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

export interface Verify2FASetupResponse {
  message: string;
  backupCodes: string[];
}
