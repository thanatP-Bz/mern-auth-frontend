export interface authResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
  };
}
