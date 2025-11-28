import api from "axios";

export interface AuthResponse {
  id: string;
  email: string;
  password: string;
  token: string;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>(
    "http://localhost:4004/api/auth/register",
    {
      name,
      email,
      password,
    }
  );
  return res.data;
};
