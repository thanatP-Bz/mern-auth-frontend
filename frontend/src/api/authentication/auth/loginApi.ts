import type { authResponse } from "@/types/authUser";
import api from "@/api/axios/axiosConfig";

export const loginUser = async (
  email: string,
  password: string,
): Promise<authResponse> => {
  const res = await api.post<authResponse>("/api/auth/login", {
    email,
    password,
  });

  return res.data;
};
