import axios from "axios";
import type { EmailUser } from "@/types/emailUser";

export const forgetPassword = async (email: string): Promise<EmailUser> => {
  const res = await axios.post(
    "http://localhost:4004/api/auth/forget-password",
    { email }
  );

  return res.data;
};
