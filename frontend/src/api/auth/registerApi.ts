import api from "axios";
import type { AuthUser } from "../types/authUser";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthUser> => {
  const res = await api.post<AuthUser>(
    "http://localhost:4004/api/auth/register",
    {
      name,
      email,
      password,
    }
  );
  return res.data;
};
