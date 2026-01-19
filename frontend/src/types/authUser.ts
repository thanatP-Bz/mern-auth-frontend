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
  };
}

export type authResponse = Require2FAResponse | LoginSuccessResponse;
