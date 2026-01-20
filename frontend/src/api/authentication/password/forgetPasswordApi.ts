import api from "@/api/axios/axiosConfig";
import type { EmailUser } from "@/types/emailUser";

export const forgetPassword = async (email: string): Promise<EmailUser> => {
  const res = await api.post("/api/auth/forget-password", { email });

  return res.data;
};
