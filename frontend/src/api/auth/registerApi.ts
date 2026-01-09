import api from "../axios/axiosConfig";
import type { authResponse } from "@/types/authUser";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<authResponse> => {
  const res = await api.post<authResponse>("/api/auth/register", {
    name,
    email,
    password,
  });
  console.log("📦 Full response from backend:", res.data);
  return res.data;
};
