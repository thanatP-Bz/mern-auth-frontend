export interface RegisterResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}
