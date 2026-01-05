import api from "axios";
import type { RegisterResponse } from "@/types/authUser";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>(
    "http://localhost:4004/api/auth/register",
    {
      name,
      email,
      password,
    }
  );
  return res.data;
};
