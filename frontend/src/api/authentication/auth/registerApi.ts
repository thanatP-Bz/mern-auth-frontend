import api from "@/api/axios/axiosConfig";
import type { RegiesterSuccessResponse } from "@/types/authUser";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<RegiesterSuccessResponse> => {
  const res = await api.post<RegiesterSuccessResponse>("/api/auth/register", {
    name,
    email,
    password,
  });
  console.log("📦 Full response from backend:", res.data);
  return res.data;
};
